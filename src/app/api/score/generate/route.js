import { generateScore } from "@/server/adapters/ai";
import { ApiError, createMeta, fail, getRequestId, ok, readJson, requireActor, requireString, resolveMode } from "@/server/api/route-kit";
import { getScoreFallback } from "@/server/demo/fallbacks";
import { saveScoreSnapshot } from "@/server/services/persistence";
import { normalizeScore } from "@/server/services/score";

export async function POST(request) {
  const requestId = getRequestId(request);
  try {
    const actor = await requireActor(request, { allowDemo: true, roles: ["trader", "admin", "lender"] });
    const payload = await readJson(request);
    const traderId = requireString(payload.traderId, "traderId", { optional: true }) ?? actor.id;
    const transactions = Array.isArray(payload.transactions) ? payload.transactions : [];
    const live = await generateScore({ ...payload, transactions });
    const mode = resolveMode(live);
    const source = live ?? getScoreFallback();
    const score = normalizeScore(source.econIdScore ?? source.score, getScoreFallback().score);
    const data = {
      ...source,
      score,
      econIdScore: score,
    };

    await saveScoreSnapshot({
      actor_id: actor.id,
      trader_id: traderId,
      score,
      credit_tier: data.creditTier ?? null,
      payload: data,
      mode,
    });

    return ok(data, createMeta(mode, requestId));
  } catch (error) {
    if (error instanceof ApiError) return fail(error, requestId);
    return fail(new ApiError("Failed to generate score", 500), requestId);
  }
}
