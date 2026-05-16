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
import { getCreditFallback } from "@/server/demo/fallbacks";
import { saveCreditRepayment } from "@/server/services/persistence";

export async function POST(request) {
  const requestId = getRequestId(request);
  try {
    const actor = await requireActor(request, { allowDemo: true, roles: ["trader", "admin"] });
    const payload = await readJson(request);
    const amount = requireNumber(payload.amount, "amount", { min: 1 });
    const live = await initiatePayment({ ...payload, traderId: payload.traderId ?? actor.id, amount }, "credit_repayment").catch((error) => {
      if (error instanceof SquadError) return null;
      throw error;
    });
    const mode = resolveMode(live);
    const data = live ?? {
      ...getCreditFallback(),
      status: "repayment_recorded",
    };

    const saved = await saveCreditRepayment({
      actor_id: actor.id,
      trader_id: payload.traderId ?? actor.id,
      amount,
      status: data.status ?? "submitted",
      provider_reference: data.transactionRef ?? data.transferReference ?? null,
      payload: data,
      mode,
    });

    return ok({ ...data, repaymentId: saved?.id ?? null }, createMeta(mode, requestId));
  } catch (error) {
    if (error instanceof ApiError) return fail(error, requestId);
    return fail(new ApiError("Failed to process credit repayment", 500), requestId);
  }
}
