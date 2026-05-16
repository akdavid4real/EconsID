import {
  ApiError,
  createMeta,
  fail,
  getRequestId,
  ok,
  requireActor,
} from "@/server/api/route-kit";
import { getLenderSummary } from "@/server/services/read-models";

export async function GET(request) {
  const requestId = getRequestId(request);
  try {
    await requireActor(request, { roles: ["lender", "admin"] });
    const data = await getLenderSummary();
    return ok(data, createMeta("live", requestId));
  } catch (error) {
    if (error instanceof ApiError) return fail(error, requestId);
    return fail(new ApiError("Unable to load lender summary", 500), requestId);
  }
}
