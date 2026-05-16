import { simulateVirtualAccountPayment, SquadError } from "@/server/adapters/squad";
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

export async function POST(request) {
  const requestId = getRequestId(request);
  try {
    await requireActor(request, { allowDemo: true, roles: ["admin", "lender"] });
    const payload = await readJson(request);
    const virtualAccountNumber = requireString(payload.virtualAccountNumber, "virtualAccountNumber", { optional: true }) ?? "7834927713";
    const amount = requireNumber(payload.amount, "amount", { min: 1, optional: true }) ?? 10000;
    const live = await simulateVirtualAccountPayment({ virtualAccountNumber, amount }).catch((error) => {
      if (error instanceof SquadError) return null;
      throw error;
    });
    const mode = resolveMode(live);

    return ok(
      live ?? {
        status: "demo_simulated_payment",
        provider: "squad-sandbox",
        virtualAccountNumber,
        amount,
      },
      createMeta(mode, requestId)
    );
  } catch (error) {
    if (error instanceof ApiError) return fail(error, requestId);
    return fail(new ApiError("Failed to simulate Squad payment", 500), requestId);
  }
}
