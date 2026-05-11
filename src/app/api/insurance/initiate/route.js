import { NextResponse } from "next/server";
import { createOk } from "@/lib/utils";
import { initiatePayment } from "@/server/adapters/squad";
import { getInsuranceFallback } from "@/server/demo/fallbacks";

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const live = await initiatePayment(payload);

  return NextResponse.json(createOk(live ?? getInsuranceFallback(), { mode: live ? "live" : "demo" }));
}
