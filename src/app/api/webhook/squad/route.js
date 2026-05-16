import { extractWebhookEvent, verifySquadWebhook } from "@/server/adapters/squad";
import crypto from "node:crypto";
import { ApiError, createMeta, fail, getRequestId, ok } from "@/server/api/route-kit";
import { applySquadWebhook, getWebhookEventByHash, saveWebhookEvent } from "@/server/services/persistence";

export async function POST(request) {
  const requestId = getRequestId(request);
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-squad-encrypted-body") ?? "";
    const valid = verifySquadWebhook(rawBody, signature);
    if (!valid) {
      throw new ApiError("Invalid Squad webhook signature", 401);
    }

    const eventHash = crypto.createHash("sha256").update(rawBody).digest("hex");
    const existing = await getWebhookEventByHash(eventHash);
    if (existing) {
      throw new ApiError("Duplicate webhook event", 409);
    }

    const payload = JSON.parse(rawBody || "{}");
    const event = extractWebhookEvent(payload);

    await saveWebhookEvent({
      source: "squad",
      event_hash: eventHash,
      signature,
      payload: {
        ...payload,
        parsed: event,
      },
      mode: "webhook",
    });

    await applySquadWebhook(event);

    return ok(
      {
        received: true,
        acknowledgement: "Squad webhook received",
        transactionRef: event.transactionRef ?? null,
        event: event.event,
      },
      createMeta("webhook", requestId)
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return fail(new ApiError("Webhook payload must be valid JSON", 400), requestId);
    }
    if (error instanceof ApiError) return fail(error, requestId);
    return fail(new ApiError("Failed to process webhook", 500), requestId);
  }
}
