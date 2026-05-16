import { createVirtualAccount, SquadError } from "@/server/adapters/squad";
import { ApiError, createMeta, fail, ok, readJson, requireActor, requireString, resolveMode, getRequestId } from "@/server/api/route-kit";
import { getOnboardingFallback } from "@/server/demo/fallbacks";
import { saveOnboardingEvent, saveTraderProfile } from "@/server/services/persistence";

export async function POST(request) {
  const requestId = getRequestId(request);
  try {
    const actor = await requireActor(request, { allowDemo: true, roles: ["trader", "admin"] });
    const payload = await readJson(request);
    const phone = requireString(payload.phone, "phone");
    const fullName = requireString(payload.fullName, "fullName");
    const market = requireString(payload.market, "market", { optional: true });
    const category = requireString(payload.category, "category", { optional: true });
    await saveTraderProfile({
      external_id: actor.id,
      full_name: fullName,
      market,
      category,
      location: payload.location ?? "Lagos",
    });
    const live = await createVirtualAccount({ ...payload, traderId: actor.id, phone, fullName, market, category }).catch((error) => {
      if (error instanceof SquadError) return null;
      throw error;
    });
    const mode = resolveMode(live);
    const data = live ?? {
      ...getOnboardingFallback(),
      status: "squad_sandbox_fallback",
      providerMessage: "Squad sandbox fallback",
    };

    const saved = await saveOnboardingEvent({
      actor_id: actor.id,
      trader_id: data.traderId ?? actor.id,
      mode,
      status: data.status ?? "submitted",
      provider: data.provider ?? "fallback",
      payload: data,
    });

    return ok({ ...data, onboardingId: saved?.id ?? null }, createMeta(mode, requestId));
  } catch (error) {
    if (error instanceof ApiError) return fail(error, requestId);
    return fail(new ApiError("Failed to process onboarding", 500), requestId);
  }
}
