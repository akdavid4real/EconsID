import { NextResponse } from "next/server";
import { createOk } from "@/lib/utils";
import { generateStory } from "@/server/adapters/ai";
import { getStoryFallback } from "@/server/demo/fallbacks";

export async function GET() {
  const live = await generateStory({});

  return NextResponse.json(createOk(live ?? getStoryFallback(), { mode: live ? "live" : "demo" }));
}
