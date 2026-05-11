import { NextResponse } from "next/server";
import { createOk } from "@/lib/utils";
import { scanRisk } from "@/server/adapters/ai";
import { getRiskFallback } from "@/server/demo/fallbacks";

export async function GET() {
  const live = await scanRisk({ activeLoans: [] });

  return NextResponse.json(createOk(live ?? getRiskFallback(), { mode: live ? "live" : "demo" }));
}
