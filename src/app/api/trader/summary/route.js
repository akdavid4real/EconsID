import {
  ApiError,
  createMeta,
  fail,
  getRequestId,
  ok,
  requireActor,
} from "@/server/api/route-kit";
import { getTraderSummary } from "@/server/services/read-models";

export async function GET(request) {
  const requestId = getRequestId(request);
  try {
    const actor = await requireActor(request, { roles: ["trader", "admin"] });
    const data = await getTraderSummary(actor);
    return ok(data, createMeta("live", requestId));
  } catch (error) {
    if (error instanceof ApiError) return fail(error, requestId);
    return fail(new ApiError("Unable to load trader summary", 500), requestId);
  }
}
