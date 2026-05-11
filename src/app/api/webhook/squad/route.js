import { NextResponse } from "next/server";
import { createError, createOk } from "@/lib/utils";
import { verifySquadWebhook } from "@/server/adapters/squad";

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-squad-encrypted-body") ?? "";
  const valid = verifySquadWebhook(rawBody, signature);

  if (!valid) {
    return NextResponse.json(createError("Invalid Squad webhook signature"), { status: 401 });
  }

  return NextResponse.json(createOk({ received: true }, { mode: "webhook" }));
}
