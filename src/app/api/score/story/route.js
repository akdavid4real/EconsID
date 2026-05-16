import { generateStory } from "@/server/adapters/ai";
import { ApiError, createMeta, fail, getRequestId, ok, requireActor, resolveMode } from "@/server/api/route-kit";
import { getStoryFallback } from "@/server/demo/fallbacks";
import { saveScoreSnapshot } from "@/server/services/persistence";
import { normalizeScore } from "@/server/services/score";
import { getScoreFallback } from "@/server/demo/fallbacks";

export async function GET(request) {
  const requestId = getRequestId(request);
  try {
    const actor = await requireActor(request, { allowDemo: true, roles: ["trader", "admin", "lender"] });
    const live = await generateStory({ actorId: actor.id });
    const mode = resolveMode(live);
    const fallback = getScoreFallback();
    const data = {
      ...fallback,
      ...getStoryFallback(),
      ...(live ?? {}),
    };

    await saveScoreSnapshot({
      actor_id: actor.id,
      trader_id: actor.id,
      score: normalizeScore(data.econIdScore ?? data.score, fallback.score),
      credit_tier: data.creditTier ?? null,
      story: data.story,
      payload: data,
      mode,
    });

    return ok(data, createMeta(mode, requestId));
  } catch (error) {
    if (error instanceof ApiError) return fail(error, requestId);
    return fail(new ApiError("Failed to generate score story", 500), requestId);
  }
}
