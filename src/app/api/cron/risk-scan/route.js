import { scanRisk } from "@/server/adapters/ai";
import { ApiError, assertCronSecret, createMeta, fail, getRequestId, ok, resolveMode } from "@/server/api/route-kit";
import { getRiskFallback } from "@/server/demo/fallbacks";
import { saveRiskScan } from "@/server/services/persistence";

export async function GET(request) {
  const requestId = getRequestId(request);
  try {
    assertCronSecret(request);
    const live = await scanRisk({ activeLoans: [] });
    const mode = resolveMode(live);
    const data = live ?? getRiskFallback();

    await saveRiskScan({
      actor_id: "cron",
      scanned: data.scanned ?? 0,
      alerts_created: data.alertsCreated ?? 0,
      payload: data,
      mode,
    });

    return ok(data, createMeta(mode, requestId));
  } catch (error) {
    if (error instanceof ApiError) return fail(error, requestId);
    return fail(new ApiError("Failed to run risk scan", 500), requestId);
  }
}
