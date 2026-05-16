"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock3,
  Landmark,
  LineChart,
  LockKeyhole,
  ReceiptText,
  Send,
  ShieldCheck,
  Store,
  TrendingUp,
  Upload,
  WalletCards,
} from "lucide-react";
import { AppShell } from "@/components/shells/app-shells";
import {
  ActionTile,
  AppTable,
  Badge,
  Button,
  Card,
  Field,
  Input,
  LockedOverlay,
  ProgressRing,
  SectionTitle,
  StatCard,
} from "@/components/ui/primitives";
import { fetchJson } from "@/lib/client-api";
import { postJson } from "@/lib/client-api";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import {
  CreditApplyForm,
  CreditRepayForm,
  InsuranceClaimForm,
  InsuranceSubscribeForm,
} from "@/features/trader/action-forms";
import { TraderLiveSummary } from "@/features/trader/live-summary";

function useTraderWorkspace() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    workspace: null,
  });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetchJson("/api/trader/summary");
        if (active) {
          setState({
            loading: false,
            error: "",
            workspace: response.data?.workspace ?? null,
          });
        }
      } catch (error) {
        if (active) {
          setState({
            loading: false,
            error: error.message,
            workspace: null,
          });
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  async function reload() {
    setState((current) => ({ ...current, loading: true, error: "" }));
    try {
      const response = await fetchJson("/api/trader/summary");
      setState({
        loading: false,
        error: "",
        workspace: response.data?.workspace ?? null,
      });
    } catch (error) {
      setState({
        loading: false,
        error: error.message,
        workspace: null,
      });
    }
  }

  return { ...state, reload };
}

function formatMoney(value, fallback = "Not yet available") {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return fallback;
  return formatCurrency(amount);
}

function formatCompactMoney(value, fallback = "Not yet available") {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return fallback;
  return formatCompactCurrency(amount);
}

function LoadingShell({ title, subtitle, current = "/dashboard" }) {
  return (
    <AppShell title={title} subtitle={subtitle} rightLabel="Loading" current={current}>
      <Card className="space-y-3">
        <SectionTitle title="Loading your workspace" body="Pulling your latest saved EconID records." />
      </Card>
    </AppShell>
  );
}

function ErrorShell({ title, subtitle, error, current = "/dashboard" }) {
  return (
    <AppShell title={title} subtitle={subtitle} rightLabel="Error" current={current}>
      <Card className="space-y-3">
        <SectionTitle title="Workspace unavailable" body={error} />
      </Card>
    </AppShell>
  );
}

function EmptyDataNotice({ message }) {
  if (!message) return null;
  return (
    <Card className="space-y-2 border-dashed bg-[var(--color-surface-alt)]/60">
      <SectionTitle title="Finish setup" body={message} />
    </Card>
  );
}

function ScoreGenerationCard({ onGenerated }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await postJson("/api/score/generate", { transactions: [] });
      setMessage(`Score saved in ${response.meta?.mode ?? "saved"} mode.`);
      await onGenerated?.();
      router.refresh();
    } catch (submitError) {
      setError(submitError.message || "Unable to generate score");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="space-y-4 border-[var(--color-border)] bg-white">
      <SectionTitle
        title="Generate your score"
        body="Weekly sales, 90-day inflow, and score-driven credit details appear after you save a score snapshot."
      />
      {error ? <p className="text-sm font-medium text-[var(--color-danger)]">{error}</p> : null}
      {message ? <p className="text-sm font-medium text-[var(--color-primary)]">{message}</p> : null}
      <Button tone="gold" className="justify-center" icon={false} onClick={handleGenerate}>
        {loading ? "Generating..." : "Generate score now"}
      </Button>
    </Card>
  );
}

function HeroAccountCard({ trader }) {
  return (
    <Card className="relative overflow-hidden border-[var(--color-border)] bg-white">
      <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(90deg,rgba(63,125,82,0.1),rgba(184,135,43,0.1))]" />
      <div className="relative space-y-5">
        <div className="flex items-center justify-between">
          <Badge tone="gold">
            <Store className="h-3.5 w-3.5" aria-hidden="true" />
            {trader.market}
          </Badge>
          <Badge tone={trader.hasSavedData ? "positive" : "warning"}>
            {trader.hasSavedData ? "Saved account" : "Needs setup"}
          </Badge>
        </div>
        <div>
          <p className="text-sm text-[var(--color-muted)]">Your payment account</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-[var(--color-primary-strong)]">
            {trader.virtualAccount || "Not yet assigned"}
          </p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">{trader.name}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[var(--color-surface-alt)]/80 p-3">
            <p className="text-xs text-[var(--color-muted)]">Weekly sales</p>
            <p className="mt-1 text-lg font-semibold text-[var(--color-primary-strong)]">
              {formatCompactMoney(trader.weeklyRevenue)}
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--color-surface-alt)]/80 p-3">
            <p className="text-xs text-[var(--color-muted)]">Credit ready</p>
            <p className="mt-1 text-lg font-semibold text-[var(--color-primary-strong)]">
              {formatCompactMoney(trader.availableCredit)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function SummaryGrid({ trader }) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <StatCard icon={LineChart} label="Weekly sales" value={formatCompactMoney(trader.weeklyRevenue)} hint={trader.hasSavedData ? "From your latest saved records" : "No saved sales data yet"} />
      <StatCard icon={TrendingUp} label="90-day inflow" value={formatCompactMoney(trader.inflow90d)} hint={trader.hasSavedData ? "Recorded from saved score data" : "No saved inflow summary yet"} />
      <StatCard icon={ShieldCheck} label="Cover" value={trader.coverage.status} hint={trader.coverage.activePlan} />
      <StatCard icon={Landmark} label="Credit" value={trader.trustBand} hint={trader.availableCredit > 0 ? formatMoney(trader.availableCredit) : "No saved credit offer yet"} />
    </div>
  );
}

export function TraderHomeScreen() {
  const state = useTraderWorkspace();

  if (state.loading) {
    return <LoadingShell title="Your dashboard" subtitle="Loading saved trader activity" />;
  }

  if (state.error || !state.workspace) {
    return <ErrorShell title="Your dashboard" subtitle="Saved trader activity" error={state.error || "Unable to load account"} />;
  }

  const trader = state.workspace;

  return (
    <AppShell
      title={`Hi, ${trader.name}`}
      subtitle={`${trader.category} in ${trader.location}`}
      rightLabel={trader.statusLabel}
      current="/dashboard"
    >
      <HeroAccountCard trader={trader} />
      <EmptyDataNotice message={trader.emptyMessage} />
      {trader.score <= 0 || trader.weeklyRevenue <= 0 ? <ScoreGenerationCard onGenerated={state.reload} /> : null}
      <div className="grid gap-3">
        <Card className="space-y-3 border-[var(--color-border)] bg-[var(--color-surface-alt)]/80">
          <SectionTitle title="Start here" body="Move through setup, score, cover, then credit in that order." />
          <div className="grid gap-2">
            <div className="flex items-center gap-3 rounded-2xl bg-[rgba(255,255,255,0.72)] p-3">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--color-accent-soft)] font-semibold text-[#21593a]">1</span>
              <p className="text-sm text-[var(--color-ink)]">Finish your profile and payout details.</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-[rgba(255,255,255,0.72)] p-3">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--color-accent-soft)] font-semibold text-[#21593a]">2</span>
              <p className="text-sm text-[var(--color-ink)]">Generate your score from saved activity.</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-[rgba(255,255,255,0.72)] p-3">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--color-accent-soft)] font-semibold text-[#21593a]">3</span>
              <p className="text-sm text-[var(--color-ink)]">Use cover or credit when your account is ready.</p>
            </div>
          </div>
        </Card>
        <ActionTile icon={ReceiptText} title="See my score" body="Check the latest score and the signals behind it." href="/dashboard/identity" />
        <ActionTile
          icon={ShieldCheck}
          title="My cover"
          body={
            trader.coverage.amount > 0
              ? `${formatMoney(trader.coverage.amount)} protection. Latest claim: ${trader.latestClaimStatus}.`
              : trader.latestClaimStatus !== "Not yet recorded"
                ? `No active cover saved yet. Latest claim: ${trader.latestClaimStatus}.`
                : "No active cover saved yet."
          }
          href="/dashboard/insurance"
          tone="gold"
        />
        <ActionTile
          icon={WalletCards}
          title="Apply for cash"
          body={trader.availableCredit > 0 ? `${formatMoney(trader.availableCredit)} ready for review.` : "No saved credit application yet."}
          href="/dashboard/credit"
        />
      </div>
      <SummaryGrid trader={trader} />
      <TraderLiveSummary />
      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <SectionTitle title="Saved activity" body="Recent account activity that can feed your score." />
          <Button as="link" href="/dashboard/transactions" tone="secondary" className="min-h-10 px-4" icon={false}>
            All
          </Button>
        </div>
        <div className="grid gap-3">
          {trader.inflows.length > 0 ? (
            trader.inflows.map((inflow) => (
              <div key={`${inflow.name}-${inflow.when}`} className="flex items-center gap-3 rounded-3xl bg-[var(--color-surface-alt)]/80 p-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--color-accent-soft)]/90 text-[#21593a]">
                  <Send className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{inflow.name}</p>
                  <p className="truncate text-sm text-[var(--color-muted)]">
                    {inflow.method} - {inflow.when}
                  </p>
                </div>
                <p className="font-semibold text-[var(--color-primary-strong)]">
                  {inflow.amount > 0 ? formatMoney(inflow.amount) : "Saved"}
                </p>
              </div>
            ))
          ) : (
            <p className="rounded-3xl bg-[var(--color-surface-alt)]/80 p-4 text-sm text-[var(--color-muted)]">
              No saved account activity yet. Complete onboarding and generate a score to populate this section.
            </p>
          )}
        </div>
      </Card>
    </AppShell>
  );
}

export function IdentityScreen() {
  const state = useTraderWorkspace();

  if (state.loading) {
    return <LoadingShell title="My EconID" subtitle="Score, proof, and shareable profile" />;
  }

  if (state.error || !state.workspace) {
    return <ErrorShell title="My EconID" subtitle="Score, proof, and shareable profile" error={state.error || "Unable to load score"} />;
  }

  const trader = state.workspace;

  return (
    <AppShell title="My EconID" subtitle="Score, proof, and shareable profile" rightLabel={trader.statusLabel} current="/dashboard">
      <ProgressRing score={trader.score} label="EconID score" />
      <Card className="space-y-4">
        <SectionTitle title="Why this score looks this way" body={trader.story} />
        <div className="grid gap-2">
          {trader.identityBreakdown.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
              <span className="text-sm text-[var(--color-muted)]">{label}</span>
              <span className="font-bold">{value}</span>
            </div>
          ))}
        </div>
      </Card>
      <TraderLiveSummary section="identity" />
      <Card className="space-y-4 !bg-[var(--color-shell)] text-white">
        <SectionTitle tone="dark" title="Share this link" body="Use the public profile when a lender needs quick proof." />
        <div className="grid place-items-center rounded-3xl bg-white p-8 text-[var(--color-ink)]">
          <div className="grid h-36 w-36 place-items-center rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-center text-xs font-bold text-[var(--color-muted)]">
            QR profile
          </div>
        </div>
        <Button as="link" href={`/share/${trader.id}`} tone="gold">
          Open share profile
        </Button>
      </Card>
    </AppShell>
  );
}

export function InsuranceOverviewScreen() {
  const state = useTraderWorkspace();

  if (state.loading) {
    return <LoadingShell title="Protection" subtitle="Daily cover for stock, stall, and income" current="/dashboard/insurance" />;
  }

  if (state.error || !state.workspace) {
    return <ErrorShell title="Protection" subtitle="Daily cover for stock, stall, and income" error={state.error || "Unable to load cover"} current="/dashboard/insurance" />;
  }

  const trader = state.workspace;

  return (
    <AppShell title="Protection" subtitle="Daily cover for stock, stall, and income" rightLabel={trader.statusLabel} current="/dashboard/insurance">
      <Card className="space-y-5 !bg-[var(--color-shell)] text-white">
        <div className="flex items-center justify-between">
          <Badge tone="gold">{trader.coverage.status}</Badge>
          <ShieldCheck className="h-8 w-8 text-[var(--color-gold)]" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm text-white/85">Your cover now</p>
          <p className="mt-1 text-5xl font-black">{formatMoney(trader.coverage.amount, "No active cover")}</p>
          <p className="mt-2 text-sm text-white/90">
            {trader.coverage.activePlan}
            {trader.latestClaimStatus !== "Not yet recorded" ? ` • Latest claim: ${trader.latestClaimStatus}` : ""}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button as="link" href="/dashboard/insurance/claim" tone="gold">
            File claim
          </Button>
          <Button as="link" href="/dashboard/insurance/subscribe" tone="secondary">
            Plans
          </Button>
        </div>
      </Card>
      <div className="grid gap-3">
        {trader.plans.map((plan) => (
          <div key={plan.name} className="relative rounded-[26px] border border-[var(--color-border)] bg-white p-5 shadow-[0_16px_44px_rgba(7,24,47,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-accent-soft)] text-[#21593a]">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-black">{plan.name}</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{plan.tier}</p>
                </div>
              </div>
              <p className="text-xl font-black">
                {formatMoney(plan.price)}
                <span className="text-sm text-[var(--color-muted)]">/day</span>
              </p>
            </div>
            <div className="mt-4 h-2 rounded-full bg-[var(--color-surface-alt)]">
              <div className="h-2 rounded-full bg-[var(--color-accent)]" style={{ width: plan.status === "locked" ? "35%" : "78%" }} />
            </div>
            {plan.status === "recommended" ? <Badge tone="gold">Best fit for current score</Badge> : null}
            {plan.status === "locked" ? <LockedOverlay title="Locked" body="Build a stronger score to open this tier." /> : null}
          </div>
        ))}
      </div>
      <TraderLiveSummary section="insurance" />
    </AppShell>
  );
}

export function InsuranceSubscribeScreen() {
  const state = useTraderWorkspace();

  if (state.loading) {
    return <LoadingShell title="Choose Cover" subtitle="Start a cover request" current="/dashboard/insurance" />;
  }

  if (state.error || !state.workspace) {
    return <ErrorShell title="Choose Cover" subtitle="Start a cover request" error={state.error || "Unable to load cover options"} current="/dashboard/insurance" />;
  }

  return (
    <AppShell title="Choose Cover" subtitle="Start a cover request" rightLabel={state.workspace.statusLabel} current="/dashboard/insurance">
      <Card className="space-y-4">
        <SectionTitle title="Stall + Stock cover" body="Choose a plan and start the subscription flow for this account." />
        <div className="rounded-3xl bg-[var(--color-gold-soft)] p-4">
          <p className="text-sm font-bold text-[#7a5512]">Daily premium</p>
          <p className="mt-1 text-4xl font-black">{formatMoney(300)}</p>
        </div>
        <InsuranceSubscribeForm />
      </Card>
    </AppShell>
  );
}

export function InsuranceClaimScreen() {
  const state = useTraderWorkspace();

  if (state.loading) {
    return <LoadingShell title="File a Claim" subtitle="Simple report with photo evidence" current="/dashboard/insurance" />;
  }

  if (state.error || !state.workspace) {
    return <ErrorShell title="File a Claim" subtitle="Simple report with photo evidence" error={state.error || "Unable to load claim flow"} current="/dashboard/insurance" />;
  }

  return (
    <AppShell title="File a Claim" subtitle="Simple report with photo evidence" rightLabel={state.workspace.statusLabel} current="/dashboard/insurance">
      <Card className="grid gap-4">
        <InsuranceClaimForm />
      </Card>
    </AppShell>
  );
}

export function InsuranceClaimDetailScreen({ claimId }) {
  const state = useTraderWorkspace();

  if (state.loading) {
    return <LoadingShell title="Claim Result" subtitle={`Reference: ${claimId}`} current="/dashboard/insurance" />;
  }

  if (state.error || !state.workspace) {
    return <ErrorShell title="Claim Result" subtitle={`Reference: ${claimId}`} error={state.error || "Unable to load claim"} current="/dashboard/insurance" />;
  }

  return (
    <AppShell title="Claim Result" subtitle={`Reference: ${claimId}`} rightLabel={state.workspace.statusLabel} current="/dashboard/insurance">
      <TraderLiveSummary section="claim-detail" />
    </AppShell>
  );
}

export function CreditOverviewScreen() {
  const state = useTraderWorkspace();

  if (state.loading) {
    return <LoadingShell title="Working Capital" subtitle="Credit earned from daily trade" current="/dashboard/credit" />;
  }

  if (state.error || !state.workspace) {
    return <ErrorShell title="Working Capital" subtitle="Credit earned from daily trade" error={state.error || "Unable to load credit"} current="/dashboard/credit" />;
  }

  const trader = state.workspace;

  return (
    <AppShell title="Working Capital" subtitle="Credit earned from daily trade" rightLabel={trader.statusLabel} current="/dashboard/credit">
      <Card className="space-y-5 !bg-[var(--color-shell)] text-white">
        <Badge tone="gold">{trader.trustBand}</Badge>
        <div>
          <p className="text-sm text-white/85">You can apply for</p>
          <p className="mt-1 text-5xl font-black">{formatMoney(trader.availableCredit, "No saved offer")}</p>
          <p className="mt-2 text-sm text-white/90">Saved score and repayment history determine what appears here.</p>
        </div>
        <Button as="link" href="/dashboard/credit/apply" tone="gold">
          Apply now
        </Button>
      </Card>
      <div className="grid gap-3">
        {trader.loans.map((loan) => (
          <div key={loan.name} className="relative rounded-[26px] border border-[var(--color-border)] bg-white p-5 shadow-[0_16px_44px_rgba(7,24,47,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">{loan.name}</p>
                <p className="mt-2 text-3xl font-black">{formatMoney(loan.amount)}</p>
              </div>
              {loan.locked ? <LockKeyhole className="h-6 w-6 text-[var(--color-muted)]" /> : <CheckCircle2 className="h-6 w-6 text-[#21593a]" />}
            </div>
            <p className="mt-3 text-sm text-[var(--color-muted)]">{loan.status}</p>
          </div>
        ))}
      </div>
      <TraderLiveSummary section="credit" />
    </AppShell>
  );
}

export function CreditApplyScreen() {
  const state = useTraderWorkspace();

  if (state.loading) {
    return <LoadingShell title="Apply for Credit" subtitle="Review before disbursement" current="/dashboard/credit" />;
  }

  if (state.error || !state.workspace) {
    return <ErrorShell title="Apply for Credit" subtitle="Review before disbursement" error={state.error || "Unable to load credit application"} current="/dashboard/credit" />;
  }

  const trader = state.workspace;

  return (
    <AppShell title="Apply for Credit" subtitle="Review before disbursement" rightLabel={trader.statusLabel} current="/dashboard/credit">
      <Card className="space-y-5">
        <SectionTitle title="Disbursement summary" body="We save the request first, then hand off to the payout flow when available." />
        <div className="grid gap-3">
          <div className="flex items-center justify-between rounded-3xl bg-[var(--color-surface-alt)] p-4">
            <span className="text-sm text-[var(--color-muted)]">Approved amount</span>
            <span className="font-black">{formatMoney(trader.availableCredit, "Not yet approved")}</span>
          </div>
          <div className="flex items-center justify-between rounded-3xl bg-[var(--color-surface-alt)] p-4">
            <span className="text-sm text-[var(--color-muted)]">Payout bank</span>
            <span className="font-black">{trader.bankName}</span>
          </div>
        </div>
        <CreditApplyForm />
      </Card>
    </AppShell>
  );
}

export function CreditRepayScreen() {
  const state = useTraderWorkspace();

  if (state.loading) {
    return <LoadingShell title="Repayment Plan" subtitle="Clear weekly installments" current="/dashboard/credit" />;
  }

  if (state.error || !state.workspace) {
    return <ErrorShell title="Repayment Plan" subtitle="Clear weekly installments" error={state.error || "Unable to load repayment"} current="/dashboard/credit" />;
  }

  const trader = state.workspace;

  return (
    <AppShell title="Repayment Plan" subtitle="Clear weekly installments" rightLabel={trader.statusLabel} current="/dashboard/credit">
      <div className="grid gap-3">
        {trader.repayments.length > 0 ? (
          trader.repayments.map((repayment) => (
            <div key={repayment.week} className="flex items-center gap-3 rounded-[26px] border border-[var(--color-border)] bg-white p-4 shadow-[0_12px_34px_rgba(7,24,47,0.08)]">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
                <Clock3 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{repayment.label}</p>
                <p className="text-sm text-[var(--color-muted)]">
                  {repayment.week} - {repayment.state}
                </p>
              </div>
              <p className="font-black">{formatMoney(repayment.amount)}</p>
            </div>
          ))
        ) : (
          <Card className="space-y-2">
            <SectionTitle title="No saved repayment yet" body="Repayment history appears here after the first saved repayment attempt." />
          </Card>
        )}
        <Card className="space-y-4">
          <SectionTitle title="Make a payment" body="Use the form below to submit a repayment attempt." />
          <CreditRepayForm />
        </Card>
      </div>
    </AppShell>
  );
}

export function TransactionsScreen() {
  const state = useTraderWorkspace();

  if (state.loading) {
    return <LoadingShell title="Transactions" subtitle="Activity feeding your score" />;
  }

  if (state.error || !state.workspace) {
    return <ErrorShell title="Transactions" subtitle="Activity feeding your score" error={state.error || "Unable to load transactions"} />;
  }

  const trader = state.workspace;

  return (
    <AppShell title="Transactions" subtitle="Activity feeding your score" rightLabel={trader.statusLabel} current="/dashboard">
      {trader.inflows.length > 0 ? (
        <AppTable
          columns={["Event", "Source", "Amount"]}
          rows={trader.inflows.map((item) => ({
            key: `${item.name}-${item.when}`,
            cells: [item.name, `${item.method} - ${item.when}`, item.amount > 0 ? formatMoney(item.amount) : "Saved"],
          }))}
        />
      ) : (
        <Card className="space-y-2">
          <SectionTitle title="No saved activity yet" body="Your recent saved onboarding and score events will appear here." />
        </Card>
      )}
    </AppShell>
  );
}

export function SettingsScreen() {
  const state = useTraderWorkspace();

  if (state.loading) {
    return <LoadingShell title="My Account" subtitle="Profile and payout details" current="/dashboard/settings" />;
  }

  if (state.error || !state.workspace) {
    return <ErrorShell title="My Account" subtitle="Profile and payout details" error={state.error || "Unable to load settings"} current="/dashboard/settings" />;
  }

  const trader = state.workspace;

  return (
    <AppShell title="My Account" subtitle="Profile and payout details" rightLabel={trader.statusLabel} current="/dashboard/settings">
      <Card className="grid gap-4">
        <Field label="Full Name">
          <Input defaultValue={trader.name === "Your account" ? "" : trader.name} placeholder="Your full name" />
        </Field>
        <Field label="Market Name">
          <Input defaultValue={trader.market.includes("not saved") ? "" : trader.market} placeholder="Your market or business name" />
        </Field>
        <Field label="Trade Category">
          <Input defaultValue={trader.category.includes("not saved") ? "" : trader.category} placeholder="Your trade category" />
        </Field>
        <Field label="Bank Name">
          <Input defaultValue={trader.bankName.includes("not saved") ? "" : trader.bankName} placeholder="Your payout bank" />
        </Field>
        <Button icon={Upload}>Upload profile photo</Button>
      </Card>
    </AppShell>
  );
}
