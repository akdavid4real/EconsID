import { createTransfer } from "@/server/adapters/squad";
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
import { saveCreditApplication } from "@/server/services/persistence";

export async function POST(request) {
  const requestId = getRequestId(request);
  try {
    const actor = await requireActor(request, { allowDemo: true, roles: ["trader", "admin"] });
    const payload = await readJson(request);
    const amount = requireNumber(payload.amount, "amount", { min: 1 });
    const live = await createTransfer({ ...payload, traderId: payload.traderId ?? actor.id, amount });
    const mode = resolveMode(live);
    const data = live ?? {
      ...getCreditFallback(),
      status: "queued_for_disbursement",
    };

    const saved = await saveCreditApplication({
      actor_id: actor.id,
      trader_id: payload.traderId ?? actor.id,
      amount,
      status: data.status ?? "submitted",
      provider_reference: data.transferReference ?? null,
      payload: data,
      mode,
    });

    return ok({ ...data, applicationId: saved?.id ?? null }, createMeta(mode, requestId));
  } catch (error) {
    if (error instanceof ApiError) return fail(error, requestId);
    return fail(new ApiError("Failed to apply for credit", 500), requestId);
  }
}
