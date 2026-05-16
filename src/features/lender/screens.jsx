"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Landmark,
  LineChart,
  ShieldAlert,
  Store,
  TrendingUp,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { AppShell } from "@/components/shells/app-shells";
import {
  ActionTile,
  AppTable,
  Badge,
  Button,
  Card,
  PageIntro,
  SectionTitle,
  StatCard,
} from "@/components/ui/primitives";
import { fetchJson } from "@/lib/client-api";
import { LenderLiveSummary } from "@/features/lender/live-summary";
import { SquadOperationsPanel } from "@/features/lender/squad-operations";

function useLenderWorkspace() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    workspace: null,
  });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetchJson("/api/lender/summary");
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

  return state;
}

function LoadingShell({ title, subtitle, current = "/lender" }) {
  return (
    <AppShell title={title} subtitle={subtitle} rightLabel="Loading" navKind="lender" current={current}>
      <Card className="space-y-2">
        <SectionTitle title="Loading workspace" body="Pulling saved lender activity." />
      </Card>
    </AppShell>
  );
}

function ErrorShell({ title, subtitle, error, current = "/lender" }) {
  return (
    <AppShell title={title} subtitle={subtitle} rightLabel="Error" navKind="lender" current={current}>
      <Card className="space-y-2">
        <SectionTitle title="Workspace unavailable" body={error} />
      </Card>
    </AppShell>
  );
}

export function LenderHomeScreen() {
  const state = useLenderWorkspace();

  if (state.loading) {
    return <LoadingShell title="Lender Desk" subtitle="Portfolio health and trader proof" />;
  }

  if (state.error || !state.workspace) {
    return <ErrorShell title="Lender Desk" subtitle="Portfolio health and trader proof" error={state.error || "Unable to load lender workspace"} />;
  }

  const summary = state.workspace;

  return (
    <AppShell title="Lender Desk" subtitle="Portfolio health and trader proof" rightLabel={summary.statusLabel} navKind="lender" current="/lender">
      <Card className="space-y-5 border-[var(--color-border)] bg-white">
        <div className="flex items-center justify-between">
          <Badge tone="gold">{summary.hasSavedData ? "Saved activity" : "Workspace setup"}</Badge>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
        <div>
          <p className="text-sm text-[var(--color-muted)]">What to review today</p>
          <p className="mt-1 text-4xl font-black tracking-tight text-[var(--color-ink)]">{summary.portfolioHeadline}</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">{summary.portfolioBody}</p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard icon={UsersRound} label={summary.totals[0].label} value={summary.totals[0].value} hint={summary.totals[0].hint} />
        <StatCard icon={WalletCards} label={summary.totals[1].label} value={summary.totals[1].value} hint={summary.totals[1].hint} />
        <StatCard icon={TrendingUp} label={summary.totals[2].label} value={summary.totals[2].value} hint={summary.totals[2].hint} />
        <StatCard icon={ShieldAlert} label={summary.totals[3].label} value={summary.totals[3].value} hint={summary.totals[3].hint} tone={summary.hasSavedData ? "danger" : "neutral"} />
      </div>

      <LenderLiveSummary />

      <Card className="space-y-4">
        <SectionTitle title="Start here" body="Review saved requests, then use alerts and webhook events to decide what needs attention." />
        <div className="grid gap-3 sm:grid-cols-2">
          <ActionTile icon={BadgeCheck} title="Open trader views" body="Use the trader roster to review score and profile readiness." href="/lender/traders" />
          <ActionTile icon={AlertTriangle} title="Check alerts" body="Inspect recent saved provider activity and risk signals." href="/lender/risk-alerts" tone="gold" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <SectionTitle title="Review queue" body={summary.hasSavedData ? "Recent saved items needing lender attention." : "Starter queue while the workspace is still empty."} />
          <Button as="link" href="/lender/traders" tone="secondary" className="min-h-10 px-4" icon={false}>
            Roster
          </Button>
        </div>
        <div className="grid gap-3">
          {summary.reviewQueue.map((item) => (
            <ActionTile
              key={item.id}
              icon={item.status === "At risk" ? AlertTriangle : BadgeCheck}
              title={item.name}
              body={`${item.score} - ${item.status}`}
              href={item.href}
              tone={item.status === "At risk" ? "gold" : "primary"}
            />
          ))}
        </div>
      </Card>
    </AppShell>
  );
}

export function TradersScreen() {
  const state = useLenderWorkspace();

  if (state.loading) {
    return <LoadingShell title="All Traders" subtitle="Searchable roster for lenders" />;
  }

  if (state.error || !state.workspace) {
    return <ErrorShell title="All Traders" subtitle="Searchable roster for lenders" error={state.error || "Unable to load roster"} />;
  }

  const summary = state.workspace;

  return (
    <AppShell title="All Traders" subtitle="Searchable roster for lenders" rightLabel={summary.statusLabel} navKind="lender" current="/lender">
      <Card className="space-y-2 bg-[var(--color-surface-alt)]">
        <SectionTitle title="How to use this page" body="Open trader views for a fast profile check, then move into saved alerts and requests." />
      </Card>
      <AppTable
        columns={["Trader", "Reference", "Status"]}
        rows={summary.reviewQueue.map((item) => ({
          key: item.id,
          cells: [item.name, String(item.score), item.status],
        }))}
      />
    </AppShell>
  );
}

export function TraderDetailScreen({ id }) {
  return (
    <AppShell title="Trader Profile" subtitle={`Credit review - ${id}`} rightLabel="Review" navKind="lender" current="/lender">
      <Card className="space-y-5 border-[var(--color-border)] bg-white">
        <div className="flex items-center justify-between">
          <Badge tone="gold">Review view</Badge>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
            <Store className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
        <div>
          <p className="text-4xl font-black tracking-tight text-[var(--color-ink)]">{id}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Use the saved summary blocks and webhook activity to support this review.</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <p className="text-xs text-[var(--color-muted)]">Checklist</p>
            <p className="mt-1 text-xl font-bold text-[var(--color-ink)]">Identity</p>
          </div>
          <div className="rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <p className="text-xs text-[var(--color-muted)]">Saved data</p>
            <p className="mt-1 text-xl font-bold text-[var(--color-ink)]">Profile</p>
          </div>
          <div className="rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <p className="text-xs text-[var(--color-muted)]">Decision</p>
            <p className="mt-1 text-xl font-bold text-[var(--color-ink)]">Pending</p>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Review flow" body="Check onboarding, score, requests, and provider events before approving credit." />
        <div className="grid gap-3">
          {[
            ["Identity and profile", "Confirm the trader finished setup and saved key account details."],
            ["Score and repayment signals", "Check the newest score snapshot and any repayment records."],
            ["Provider activity", "Use webhook and transaction traces to confirm the external payment path."],
          ].map(([title, body]) => (
            <div key={title} className="flex gap-3 rounded-3xl bg-[var(--color-surface-alt)] p-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#21593a]" aria-hidden="true" />
              <div>
                <p className="font-bold">{title}</p>
                <p className="text-sm text-[var(--color-muted)]">{body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button>Approve credit</Button>
          <Button tone="secondary">Reject</Button>
        </div>
      </Card>
    </AppShell>
  );
}

export function LoansScreen() {
  const state = useLenderWorkspace();

  if (state.loading) {
    return <LoadingShell title="Active Loans" subtitle="Facilities and repayment status" current="/lender/loans" />;
  }

  if (state.error || !state.workspace) {
    return <ErrorShell title="Active Loans" subtitle="Facilities and repayment status" error={state.error || "Unable to load facilities"} current="/lender/loans" />;
  }

  const summary = state.workspace;

  return (
    <AppShell title="Active Loans" subtitle="Facilities and repayment status" rightLabel={summary.statusLabel} navKind="lender" current="/lender/loans">
      <Card className="space-y-2 bg-[var(--color-surface-alt)]">
        <SectionTitle title="How to read this page" body="Saved credit applications are the first signal; open detail and alerts for confirmation." />
      </Card>
      <div className="grid gap-3">
        {summary.reviewQueue.map((item) => (
          <ActionTile
            key={item.id}
            icon={Landmark}
            title={item.name}
            body={`${item.score} - ${item.status}`}
            href="/lender/loans/demo-loan"
            tone={item.status === "At risk" ? "gold" : "primary"}
          />
        ))}
      </div>
    </AppShell>
  );
}

export function LoanDetailScreen({ loanId }) {
  return (
    <AppShell title="Loan Detail" subtitle={`Facility reference: ${loanId}`} rightLabel="Review" navKind="lender" current="/lender/loans">
      <Card className="space-y-4">
        <SectionTitle title="Facility summary" body="Use saved application, repayment, and provider references to complete the review." />
        <div className="grid gap-3">
          {[
            ["Saved request", "Check lender summary"],
            ["Repayment history", "Open trader credit view"],
            ["Provider trace", "Review saved webhook events"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-3xl bg-[var(--color-surface-alt)] p-4">
              <span className="text-sm text-[var(--color-muted)]">{label}</span>
              <span className="font-black">{value}</span>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}

export function RiskAlertsScreen() {
  const state = useLenderWorkspace();

  if (state.loading) {
    return <LoadingShell title="Risk Alerts" subtitle="Daily scan output from the risk adapter" current="/lender/risk-alerts" />;
  }

  if (state.error || !state.workspace) {
    return <ErrorShell title="Risk Alerts" subtitle="Daily scan output from the risk adapter" error={state.error || "Unable to load alerts"} current="/lender/risk-alerts" />;
  }

  const summary = state.workspace;

  return (
    <AppShell title="Risk Alerts" subtitle="Daily scan output from the risk adapter" rightLabel={summary.statusLabel} navKind="lender" current="/lender/risk-alerts">
      <Card className="space-y-2 bg-[var(--color-surface-alt)]">
        <SectionTitle title="How to read this page" body="Saved provider events and live lender actions should create the alerts shown here." />
      </Card>
      <div className="grid gap-3">
        {summary.alerts.length > 0 ? (
          summary.alerts.map((alert) => (
            <div key={`${alert.trader}-${alert.reason}`} className="rounded-[26px] border border-[var(--color-border)] bg-white p-5 shadow-[0_10px_28px_rgba(7,24,47,0.05)]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-warning-soft)] text-[var(--color-warning)]">
                    <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-black">{alert.trader}</p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">{alert.reason}</p>
                  </div>
                </div>
                <Badge tone={alert.severity === "High" ? "warning" : "neutral"}>{alert.severity}</Badge>
              </div>
            </div>
          ))
        ) : (
          <Card className="space-y-2">
            <SectionTitle title="No saved alerts yet" body="Once traders start generating real activity, lender alerts will appear here." />
          </Card>
        )}
      </div>
    </AppShell>
  );
}

export function LenderSettingsScreen() {
  const state = useLenderWorkspace();

  if (state.loading) {
    return <LoadingShell title="Lender Settings" subtitle="Institution and alert preferences" current="/lender/settings" />;
  }

  if (state.error || !state.workspace) {
    return <ErrorShell title="Lender Settings" subtitle="Institution and alert preferences" error={state.error || "Unable to load settings"} current="/lender/settings" />;
  }

  return (
    <AppShell title="Lender Settings" subtitle="Institution and alert preferences" rightLabel={state.workspace.statusLabel} navKind="lender" current="/lender/settings">
      <Card className="space-y-4">
        <PageIntro title="Portal defaults" body="Keep lender access, saved signals, and review habits in one place." />
        <ActionTile icon={LineChart} title="Daily risk email" body="Receive a summary after saved platform activity starts flowing." />
      </Card>
      <SquadOperationsPanel />
    </AppShell>
  );
}
