import { reviewClaim } from "@/server/adapters/ai";
import {
  ApiError,
  createMeta,
  fail,
  getRequestId,
  ok,
  readJson,
  requireActor,
  requireNumber,
  requireString,
  resolveMode,
} from "@/server/api/route-kit";
import { getClaimFallback } from "@/server/demo/fallbacks";
import { saveInsuranceClaim } from "@/server/services/persistence";

export async function POST(request) {
  const requestId = getRequestId(request);
  try {
    const actor = await requireActor(request, { allowDemo: true, roles: ["trader", "admin", "lender"] });
    const payload = await readJson(request);
    const description = requireString(payload.description, "description");
    const claimAmount = requireNumber(payload.claimAmount, "claimAmount", { min: 1, optional: true });
    const live = await reviewClaim({ ...payload, traderId: payload.traderId ?? actor.id, description, claimAmount });
    const mode = resolveMode(live);
    const data = live ?? getClaimFallback();

    const saved = await saveInsuranceClaim({
      actor_id: actor.id,
      trader_id: payload.traderId ?? actor.id,
      recommendation: data.recommendation ?? "pending",
      confidence: data.confidence ?? null,
      suggested_payout: data.suggestedPayout ?? claimAmount ?? null,
      status: "reviewed",
      payload: { ...data, description, claimAmount },
      mode,
    });

    return ok({ ...data, claimId: saved?.id ?? null }, createMeta(mode, requestId));
  } catch (error) {
    if (error instanceof ApiError) return fail(error, requestId);
    return fail(new ApiError("Failed to process insurance claim", 500), requestId);
  }
}
