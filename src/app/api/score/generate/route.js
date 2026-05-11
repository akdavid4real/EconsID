import { NextResponse } from "next/server";
import { createOk } from "@/lib/utils";
import { generateScore } from "@/server/adapters/ai";
import { getScoreFallback } from "@/server/demo/fallbacks";

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const live = await generateScore(payload);

  return NextResponse.json(createOk(live ?? getScoreFallback(), { mode: live ? "live" : "demo" }));
}
