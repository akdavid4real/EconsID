import { demoData } from "@/lib/demo-data";
import {
  countRows,
  getLatestRecords,
  getLatestRowForActor,
  getTraderProfileByActorId,
} from "@/server/services/persistence";

function toTitleCase(value = "") {
  return String(value)
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function humanizeStatus(value = "", fallback = "Not yet recorded") {
  if (value == null || value === "") return fallback;
  const raw = String(value).trim();
  const dictionary = {
    squad_sandbox_fallback: "Sandbox account ready",
    sandbox_account_created: "Sandbox account ready",
    queued_for_disbursement: "Queued for disbursement",
    repayment_recorded: "Repayment recorded",
    checkout_created: "Checkout created",
    initiated: "Cover started",
    active: "Active",
    reviewed: "Claim reviewed",
    disbursed: "Disbursed",
  };
  return dictionary[raw] ?? toTitleCase(raw);
}

function deriveCreditTier(scoreRow) {
  const tier = Number(scoreRow?.credit_tier ?? scoreRow?.payload?.creditTier ?? 0);
  if (!Number.isFinite(tier) || tier <= 0) return null;
  return `Tier ${tier}`;
}

function buildIdentityBreakdown({
  profile,
  latestOnboarding,
  latestScore,
  latestInsurance,
  latestCreditApplication,
}) {
  return [
    ["Profile", profile?.full_name ? "Saved" : "Not yet saved"],
    ["Market", profile?.market || latestOnboarding?.payload?.market || "Not yet saved"],
    ["Score", latestScore?.score ? `${latestScore.score} / 850` : "Not yet generated"],
    ["Cover", toTitleCase(latestInsurance?.status || "not active")],
    ["Credit", toTitleCase(latestCreditApplication?.status || "not requested")],
  ];
}

function buildCoverage(latestInsurance) {
  return {
      status: latestInsurance?.status ? toTitleCase(latestInsurance.status) : "Not active",
    rawStatus: latestInsurance?.status ?? null,
    amount: Number(latestInsurance?.payload?.amount ?? latestInsurance?.payload?.premium ?? 0),
    daysCovered: 0,
    activePlan:
      latestInsurance?.payload?.planName ||
      (latestInsurance?.payload?.tier ? `Tier ${latestInsurance.payload.tier} cover` : "No active cover"),
  };
}

function buildPlans(score) {
  const eligibleTier = score >= 800 ? 3 : score >= 650 ? 2 : 1;
  return [
    { name: "Stock Protection", tier: "Tier 1", price: 200, status: eligibleTier >= 1 ? "available" : "locked" },
    { name: "Stall + Stock", tier: "Tier 2", price: 300, status: eligibleTier >= 2 ? "recommended" : "locked" },
    { name: "Income Protection", tier: "Tier 3", price: 500, status: eligibleTier >= 3 ? "available" : "locked" },
  ];
}

function buildLoans(score, latestCreditApplication, availableCredit) {
  const approvedAmount = Number(latestCreditApplication?.amount ?? availableCredit ?? 0);
  return [
    { name: "Tier 1", amount: 50000, status: score >= 500 ? "Eligible" : "Build your score", locked: score < 500 },
    {
      name: "Tier 2",
      amount: approvedAmount > 0 ? approvedAmount : 150000,
      status: latestCreditApplication?.status ? toTitleCase(latestCreditApplication.status) : score >= 650 ? "Available to apply" : "Keep building history",
      locked: score < 650,
    },
    { name: "Tier 3", amount: 500000, status: score >= 800 ? "Available to apply" : "Unlock with stronger score", locked: score < 800 },
  ];
}

function buildRepayments(latestRepayment) {
  if (!latestRepayment) return [];
  return [
    {
      week: "Latest",
      label: "Most recent repayment",
      amount: Number(latestRepayment.amount ?? 0),
      state: humanizeStatus(latestRepayment.status || "submitted", "Submitted"),
    },
  ];
}

function buildInflowRows(latestOnboarding, latestScore, latestInsurance, latestClaim, latestCreditApplication, latestRepayment) {
  const items = [];
  if (latestOnboarding?.created_at) {
    items.push({
      name: "Onboarding completed",
      method: humanizeStatus(latestOnboarding.status || latestOnboarding.provider || latestOnboarding.mode || "saved", "Saved"),
      amount: 0,
      when: new Date(latestOnboarding.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" }),
    });
  }
  if (latestScore?.created_at) {
    items.push({
      name: "Score snapshot",
      method: toTitleCase(latestScore.mode || "saved"),
      amount: Number(latestScore.payload?.averageWeeklyRevenue ?? 0),
      when: new Date(latestScore.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" }),
    });
  }
  if (latestInsurance?.created_at) {
    items.push({
      name: "Cover request",
      method: humanizeStatus(latestInsurance.status, "Saved"),
      amount: Number(latestInsurance.premium ?? latestInsurance.payload?.premium ?? 0),
      when: new Date(latestInsurance.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" }),
    });
  }
  if (latestClaim?.created_at) {
    items.push({
      name: "Claim submitted",
      method: humanizeStatus(latestClaim.status, "Saved"),
      amount: Number(latestClaim.suggested_payout ?? latestClaim.payload?.claimAmount ?? 0),
      when: new Date(latestClaim.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" }),
    });
  }
  if (latestCreditApplication?.created_at) {
    items.push({
      name: "Credit request",
      method: humanizeStatus(latestCreditApplication.status, "Saved"),
      amount: Number(latestCreditApplication.amount ?? 0),
      when: new Date(latestCreditApplication.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" }),
    });
  }
  if (latestRepayment?.created_at) {
    items.push({
      name: "Repayment attempt",
      method: humanizeStatus(latestRepayment.status, "Saved"),
      amount: Number(latestRepayment.amount ?? 0),
      when: new Date(latestRepayment.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" }),
    });
  }
  return items;
}

function buildTraderWorkspace({
  actor,
  profile,
  latestOnboarding,
  latestScore,
  latestCreditApplication,
  latestRepayment,
  latestInsurance,
  latestClaim,
}) {
  const score = Number(latestScore?.score ?? 0);
  const availableCredit = Number(latestCreditApplication?.amount ?? 0);
  const hasSavedData = Boolean(
    profile ||
      latestOnboarding ||
      latestScore ||
      latestCreditApplication ||
      latestRepayment ||
      latestInsurance ||
      latestClaim
  );
  const name =
    profile?.full_name ||
    latestOnboarding?.payload?.fullName ||
    actor.profileName ||
    "Your account";
  const market = profile?.market || latestOnboarding?.payload?.market || "Market not saved";
  const category = profile?.category || latestOnboarding?.payload?.category || "Trade category not saved";
  const location = profile?.location || latestOnboarding?.payload?.location || "Location not saved";
  const virtualAccount =
    latestOnboarding?.payload?.virtualAccountNumber ||
    latestOnboarding?.payload?.virtualAccount ||
    null;
  const creditTier = deriveCreditTier(latestScore);
  const summaryMode = hasSavedData ? "saved" : "setup";

  return {
    id: latestOnboarding?.trader_id || latestOnboarding?.payload?.traderId || actor.id,
    name,
    market,
    category: toTitleCase(category),
    location,
    score,
    trustBand: creditTier || "Not yet scored",
    weeklyRevenue: Number(latestScore?.payload?.averageWeeklyRevenue ?? 0),
    inflow90d: Number(latestScore?.payload?.ninetyDayInflow ?? 0),
    availableCredit,
    virtualAccount,
    bankName: latestOnboarding?.payload?.bankName || "Bank not saved",
    accountNumber: latestOnboarding?.payload?.accountNumber || null,
    story: latestScore?.payload?.story || latestScore?.story || "Complete setup and generate a score to see your financial story here.",
    identityBreakdown: buildIdentityBreakdown({
      profile,
      latestOnboarding,
      latestScore,
      latestInsurance,
      latestCreditApplication,
    }),
    inflows: buildInflowRows(
      latestOnboarding,
      latestScore,
      latestInsurance,
      latestClaim,
      latestCreditApplication,
      latestRepayment
    ),
    coverage: buildCoverage(latestInsurance),
    plans: buildPlans(score),
    loans: buildLoans(score, latestCreditApplication, availableCredit),
    repayments: buildRepayments(latestRepayment),
    latestClaim,
    latestOnboarding,
    latestScore,
    latestCreditApplication,
    latestInsurance,
    latestCoverStatus: humanizeStatus(latestInsurance?.status, "Not yet recorded"),
    latestClaimStatus: humanizeStatus(latestClaim?.status, "Not yet recorded"),
    latestCreditStatus: humanizeStatus(latestCreditApplication?.status, "Not yet recorded"),
    latestRepaymentStatus: humanizeStatus(latestRepayment?.status, "Not yet recorded"),
    latestOnboardingStatus: humanizeStatus(latestOnboarding?.status, "Not yet recorded"),
    hasSavedData,
    summaryMode,
    statusLabel: summaryMode === "saved" ? "Saved" : "Setup",
    emptyMessage:
      summaryMode === "saved"
        ? ""
        : "Finish onboarding and generate a score to replace the starter placeholders with your saved account data.",
  };
}

function buildLenderWorkspace({
  latestWebhookEvents,
  creditApplicationsCount,
  insuranceClaimsCount,
  webhookEventsCount,
}) {
  const seeded = demoData.lenderSummary;
  const hasSavedData = creditApplicationsCount > 0 || insuranceClaimsCount > 0 || webhookEventsCount > 0;

  return {
    hasSavedData,
    statusLabel: hasSavedData ? "Saved" : "Setup",
    portfolioHeadline: hasSavedData ? `${creditApplicationsCount} saved applications` : "No saved portfolio activity yet",
    portfolioBody: hasSavedData
      ? `${insuranceClaimsCount} claims and ${webhookEventsCount} webhook events are available for review.`
      : "Use live trader actions to create real platform activity for this workspace.",
    totals: [
      { label: "Applications", value: String(creditApplicationsCount), hint: hasSavedData ? "Saved credit requests" : "No saved requests yet", tone: "neutral" },
      { label: "Claims", value: String(insuranceClaimsCount), hint: hasSavedData ? "Insurance activity" : "No saved claims yet", tone: "neutral" },
      { label: "Webhooks", value: String(webhookEventsCount), hint: hasSavedData ? "Provider events stored" : "No provider events yet", tone: webhookEventsCount > 0 ? "positive" : "neutral" },
      { label: "Queue", value: String(Math.max(creditApplicationsCount, insuranceClaimsCount)), hint: hasSavedData ? "Items needing review" : "Queue is empty", tone: hasSavedData ? "danger" : "neutral" },
    ],
    reviewQueue:
      latestWebhookEvents.length > 0
        ? latestWebhookEvents.map((event, index) => ({
            id: event.id || event.event_hash || `event-${index}`,
            name: event.payload?.parsed?.event || "Provider event",
            status: toTitleCase(event.payload?.parsed?.status || "received"),
            href: "/lender/risk-alerts",
            score: event.payload?.parsed?.transactionRef || event.event_hash || "Saved event",
          }))
        : seeded.traders.map((item) => ({
            ...item,
            href: `/lender/trader/${item.id}`,
          })),
    alerts:
      latestWebhookEvents.length > 0
        ? latestWebhookEvents.slice(0, 3).map((event, index) => ({
            trader: event.payload?.parsed?.event || `Saved event ${index + 1}`,
            severity: webhookEventsCount > 0 ? "Medium" : "Low",
            reason: event.payload?.parsed?.transactionRef || event.event_hash || "Stored provider event",
          }))
        : [],
  };
}

export async function getTraderSummary(actor) {
  const profile = await getTraderProfileByActorId(actor.id);
  const latestOnboarding = await getLatestRowForActor("onboarding_profiles", actor.id);
  const latestScore = await getLatestRowForActor("score_snapshots", actor.id);
  const latestCreditApplication = await getLatestRowForActor("credit_applications", actor.id);
  const latestRepayment = await getLatestRowForActor("credit_repayments", actor.id);
  const latestInsurance = await getLatestRowForActor("insurance_subscriptions", actor.id);
  const latestClaim = await getLatestRowForActor("insurance_claims", actor.id);

  return {
    profile,
    latestOnboarding,
    latestScore,
    latestCreditApplication,
    latestRepayment,
    latestInsurance,
    latestClaim,
    seededTrader: demoData.trader,
    workspace: buildTraderWorkspace({
      actor,
      profile,
      latestOnboarding,
      latestScore,
      latestCreditApplication,
      latestRepayment,
      latestInsurance,
      latestClaim,
    }),
  };
}

export async function getLenderSummary() {
  const latestWebhookEvents = await getLatestRecords("webhook_events", 5);
  const [creditApplicationsCount, insuranceClaimsCount, webhookEventsCount] = await Promise.all([
    countRows("credit_applications"),
    countRows("insurance_claims"),
    countRows("webhook_events"),
  ]);

  return {
    seededSummary: demoData.lenderSummary,
    latestWebhookEvents,
    creditApplicationsCount,
    insuranceClaimsCount,
    webhookEventsCount,
    workspace: buildLenderWorkspace({
      latestWebhookEvents,
      creditApplicationsCount,
      insuranceClaimsCount,
      webhookEventsCount,
    }),
  };
}
