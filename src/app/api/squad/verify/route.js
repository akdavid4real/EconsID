import { verifyTransaction, SquadError } from "@/server/adapters/squad";
import { ApiError, createMeta, fail, getRequestId, ok, readJson, requireActor, requireString, resolveMode } from "@/server/api/route-kit";

export async function POST(request) {
  const requestId = getRequestId(request);
  try {
    await requireActor(request, { allowDemo: true, roles: ["admin", "lender"] });
    const payload = await readJson(request);
    const transactionRef = requireString(payload.transactionRef, "transactionRef");
    const live = await verifyTransaction(transactionRef).catch((error) => {
      if (error instanceof SquadError) return null;
      throw error;
    });
    const mode = resolveMode(live);

    return ok(
      live ?? {
        status: "demo_verified",
        provider: "squad-sandbox",
        transactionRef,
        amount: 39000,
        channel: "VirtualAccount",
      },
      createMeta(mode, requestId)
    );
  } catch (error) {
    if (error instanceof ApiError) return fail(error, requestId);
    return fail(new ApiError("Failed to verify Squad transaction", 500), requestId);
  }
}
