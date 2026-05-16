import { initiatePayment, SquadError } from "@/server/adapters/squad";
import {
  ApiError,
  createMeta,
  fail,
  getRequestId,
  ok,
  readJson,
  requireActor,
  requireNumber,
  resolveMode,
} from "@/server/api/route-kit";
import { getInsuranceFallback } from "@/server/demo/fallbacks";
import { saveInsuranceSubscription } from "@/server/services/persistence";

export async function POST(request) {
  const requestId = getRequestId(request);
  try {
    const actor = await requireActor(request, { allowDemo: true, roles: ["trader", "admin"] });
    const payload = await readJson(request);
    const tier = requireNumber(payload.tier, "tier", { min: 1, max: 3, optional: true }) ?? 2;
    const premium = requireNumber(payload.premium, "premium", { min: 1, optional: true }) ?? 300;
    const live = await initiatePayment(
      { ...payload, traderId: payload.traderId ?? actor.id, tier, premium },
      "insurance_subscription"
    ).catch((error) => {
      if (error instanceof SquadError) return null;
      throw error;
    });
    const mode = resolveMode(live);
    const data = live ?? getInsuranceFallback();

    const saved = await saveInsuranceSubscription({
      actor_id: actor.id,
      trader_id: payload.traderId ?? actor.id,
      tier: data.tier ?? tier,
      premium: data.premium ?? premium,
      status: data.status ?? "initiated",
      checkout_url: data.checkoutUrl ?? null,
      payload: data,
      mode,
    });

    return ok({ ...data, subscriptionId: saved?.id ?? null }, createMeta(mode, requestId));
  } catch (error) {
    if (error instanceof ApiError) return fail(error, requestId);
    return fail(new ApiError("Failed to initiate insurance", 500), requestId);
  }
}
