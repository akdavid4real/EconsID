import { env } from "@/lib/env";

export async function generateScore(input) {
  if (!env.mistralApiKey || env.demoMode) {
    return null;
  }

  return {
    econIdScore: 640,
    inputCount: input?.transactions?.length ?? 0,
  };
}

export async function generateStory(input) {
  if (!env.mistralApiKey || env.demoMode) {
    return null;
  }

  return {
    story: `Trader profile generated for ${input?.name ?? "EconID"} via live adapter wiring.`,
  };
}

export async function reviewClaim(input) {
  if (!env.mistralApiKey || env.demoMode) {
    return null;
  }

  return {
    recommendation: "escalate",
    confidence: 0.72,
    suggestedPayout: 0,
    summary: input?.description ?? "",
  };
}

export async function scanRisk(input) {
  if (!env.mistralApiKey || env.demoMode) {
    return null;
  }

  return {
    scanned: input?.activeLoans?.length ?? 0,
    alertsCreated: 0,
  };
}
