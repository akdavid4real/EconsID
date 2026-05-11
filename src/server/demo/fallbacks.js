import { demoData } from "@/lib/demo-data";

export function getOnboardingFallback() {
  return {
    traderId: demoData.trader.id,
    status: "sandbox_account_created",
    virtualAccountNumber: demoData.trader.virtualAccount,
    provider: "squad-sandbox",
  };
}

export function getScoreFallback() {
  return {
    score: demoData.trader.score,
    creditTier: 2,
    riskFlags: [],
    averageWeeklyRevenue: demoData.trader.weeklyRevenue,
  };
}

export function getStoryFallback() {
  return { story: demoData.trader.story };
}

export function getInsuranceFallback() {
  return {
    checkoutUrl: "/dashboard/insurance?status=demo-success",
    tier: 2,
    premium: 300,
    provider: "squad-sandbox",
  };
}

export function getClaimFallback() {
  return {
    recommendation: "approve",
    confidence: 0.88,
    suggestedPayout: 10000,
  };
}

export function getCreditFallback() {
  return {
    status: "disbursed",
    approvedAmount: demoData.trader.availableCredit,
    transferReference: "SQD-DEMO-001",
  };
}

export function getRiskFallback() {
  return {
    scanned: 12,
    alertsCreated: 2,
  };
}
