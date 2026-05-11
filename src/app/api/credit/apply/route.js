import { NextResponse } from "next/server";
import { createOk } from "@/lib/utils";
import { createTransfer } from "@/server/adapters/squad";
import { getCreditFallback } from "@/server/demo/fallbacks";

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const live = await createTransfer(payload);

  return NextResponse.json(createOk(live ?? getCreditFallback(), { mode: live ? "live" : "demo" }));
}
