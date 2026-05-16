import { listTransfers, SquadError } from "@/server/adapters/squad";
import { ApiError, createMeta, fail, getRequestId, ok, requireActor, resolveMode } from "@/server/api/route-kit";

export async function GET(request) {
  const requestId = getRequestId(request);
  try {
    await requireActor(request, { allowDemo: true, roles: ["admin", "lender"] });
    const { searchParams } = new URL(request.url);
    const live = await listTransfers({
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
      page: searchParams.get("page"),
      perPage: searchParams.get("perPage"),
      reference: searchParams.get("reference"),
    }).catch((error) => {
      if (error instanceof SquadError) return null;
      throw error;
    });
    const mode = resolveMode(live);

    return ok(
      live ?? {
        status: "demo_transactions_loaded",
        provider: "squad-sandbox",
        transactions: [
          {
            transaction_ref: "ECONID_PAY_DEMO",
            transaction_amount: 3900000,
            transaction_status: "Success",
            transaction_type: "VirtualAccount",
          },
        ],
      },
      createMeta(mode, requestId)
    );
  } catch (error) {
    if (error instanceof ApiError) return fail(error, requestId);
    return fail(new ApiError("Failed to list Squad transactions", 500), requestId);
  }
}
