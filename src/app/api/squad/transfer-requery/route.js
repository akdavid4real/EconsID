import { requeryTransfer, SquadError } from "@/server/adapters/squad";
import { ApiError, createMeta, fail, getRequestId, ok, readJson, requireActor, requireString, resolveMode } from "@/server/api/route-kit";

export async function POST(request) {
  const requestId = getRequestId(request);
  try {
    await requireActor(request, { allowDemo: true, roles: ["admin", "lender"] });
    const payload = await readJson(request);
    const transactionReference = requireString(payload.transactionReference, "transactionReference");
    const live = await requeryTransfer(transactionReference).catch((error) => {
      if (error instanceof SquadError) return null;
      throw error;
    });
    const mode = resolveMode(live);

    return ok(
      live ?? {
        status: "queued_for_disbursement",
        provider: "squad-sandbox",
        transferReference: transactionReference,
      },
      createMeta(mode, requestId)
    );
  } catch (error) {
    if (error instanceof ApiError) return fail(error, requestId);
    return fail(new ApiError("Failed to requery Squad transfer", 500), requestId);
  }
}
