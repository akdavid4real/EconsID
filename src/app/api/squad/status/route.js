import { canUseSquad, env } from "@/lib/env";
import { ApiError, createMeta, fail, getRequestId, ok, requireActor } from "@/server/api/route-kit";
import { getLatestWebhookEvents } from "@/server/services/persistence";

function maskSecret(secret) {
  if (!secret) return "not configured";
  return `${secret.slice(0, 8)}...${secret.slice(-4)}`;
}

export async function GET(request) {
  const requestId = getRequestId(request);
  try {
    await requireActor(request, { allowDemo: true, roles: ["admin", "lender"] });
    const events = await getLatestWebhookEvents(5);

    return ok(
      {
        provider: "squad",
        mode: canUseSquad() ? "live-sandbox" : "demo-fallback",
        baseUrl: env.squadBaseUrl,
        secretKey: maskSecret(env.squadSecretKey),
        webhookUrl: `${env.appUrl}/api/webhook/squad`,
        latestWebhookEvents: events,
      },
      createMeta(canUseSquad() ? "live" : "demo", requestId)
    );
  } catch (error) {
    if (error instanceof ApiError) return fail(error, requestId);
    return fail(new ApiError("Failed to load Squad status", 500), requestId);
  }
}
