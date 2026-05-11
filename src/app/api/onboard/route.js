import { NextResponse } from "next/server";
import { createOk } from "@/lib/utils";
import { createVirtualAccount } from "@/server/adapters/squad";
import { getOnboardingFallback } from "@/server/demo/fallbacks";

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const live = await createVirtualAccount(payload);

  return NextResponse.json(createOk(live ?? getOnboardingFallback(), { mode: live ? "live" : "demo" }));
}
