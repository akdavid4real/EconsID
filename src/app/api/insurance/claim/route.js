import { NextResponse } from "next/server";
import { createOk } from "@/lib/utils";
import { reviewClaim } from "@/server/adapters/ai";
import { getClaimFallback } from "@/server/demo/fallbacks";

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const live = await reviewClaim(payload);

  return NextResponse.json(createOk(live ?? getClaimFallback(), { mode: live ? "live" : "demo" }));
}
