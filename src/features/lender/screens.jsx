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
import { demoData } from "@/lib/demo-data";

const summary = demoData.lenderSummary;
const trader = demoData.trader;

export function LenderHomeScreen() {
  return (
    <AppShell title="Lender Desk" subtitle="Portfolio health and trader proof" navKind="lender" current="/lender">
      <Card className="space-y-5 border-[var(--color-border)] bg-white">
        <div className="flex items-center justify-between">
          <Badge tone="gold">Today</Badge>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
        <div>
          <p className="text-sm text-[var(--color-muted)]">What to review today</p>
          <p className="mt-1 text-5xl font-black tracking-tight text-[var(--color-ink)]">NGN 48.5M</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">450 active facilities across verified traders.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <p className="text-xs text-[var(--color-muted)]">Repayment rate</p>
            <p className="mt-1 text-xl font-bold text-[var(--color-ink)]">91%</p>
          </div>
          <div className="rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <p className="text-xs text-[var(--color-muted)]">Risk alerts</p>
            <p className="mt-1 text-xl font-bold text-[var(--color-ink)]">14</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard icon={UsersRound} label="Traders" value="1,240" hint="+12% this month" />
        <StatCard icon={WalletCards} label="Loans" value="450" hint="Active facilities" />
        <StatCard icon={TrendingUp} label="Healthy" value="91%" hint="Repayment rate" />
        <StatCard icon={ShieldAlert} label="Alerts" value="14" hint="Immediate review" tone="danger" />
      </div>

      <Card className="space-y-4">
        <SectionTitle title="Start here" body="Open a trader, then check the alerts." />
        <div className="grid gap-3 sm:grid-cols-2">
          <ActionTile
            icon={BadgeCheck}
            title="Open trader"
            body="See score, story, and loan decision."
            href="/lender/traders"
          />
          <ActionTile
            icon={AlertTriangle}
            title="Check alerts"
            body="See who needs review today."
            href="/lender/risk-alerts"
            tone="gold"
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <SectionTitle title="Review queue" body="Highest-priority traders for today." />
          <Button as="link" href="/lender/traders" tone="secondary" className="min-h-10 px-4" icon={false}>
            Roster
          </Button>
        </div>
        <div className="grid gap-3">
          {summary.traders.map((item) => (
            <ActionTile
              key={item.id}
              icon={item.status === "At risk" ? AlertTriangle : BadgeCheck}
              title={item.name}
              body={`${item.id} - Score ${item.score} - ${item.status}`}
              href={`/lender/trader/${item.id}`}
              tone={item.status === "At risk" ? "gold" : "primary"}
            />
          ))}
        </div>
      </Card>
    </AppShell>
  );
}

export function TradersScreen() {
  return (
    <AppShell title="All Traders" subtitle="Searchable roster for lenders" navKind="lender" current="/lender">
      <Card className="space-y-2 bg-[var(--color-surface-alt)]">
        <SectionTitle title="How to use this page" body="Find a trader, open their profile, then decide." />
      </Card>
      <AppTable
        columns={["Trader", "Score", "Status"]}
        rows={summary.traders.map((item) => ({
          key: item.id,
          cells: [`${item.name} - ${item.id}`, String(item.score), item.status],
        }))}
      />
    </AppShell>
  );
}

export function TraderDetailScreen({ id }) {
  return (
    <AppShell title="Trader Profile" subtitle={`Credit review - ${id}`} navKind="lender" current="/lender">
      <Card className="space-y-5 border-[var(--color-border)] bg-white">
        <div className="flex items-center justify-between">
          <Badge tone="gold">Identity verified</Badge>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
            <Store className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
        <div>
          <p className="text-4xl font-black tracking-tight text-[var(--color-ink)]">{trader.name}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{trader.category} - {trader.location}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <p className="text-xs text-[var(--color-muted)]">Score</p>
            <p className="mt-1 text-xl font-bold text-[var(--color-ink)]">{trader.score}</p>
          </div>
          <div className="rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <p className="text-xs text-[var(--color-muted)]">History</p>
            <p className="mt-1 text-xl font-bold text-[var(--color-ink)]">99%</p>
          </div>
          <div className="rounded-2xl bg-[var(--color-surface-alt)] p-3">
            <p className="text-xs text-[var(--color-muted)]">Tier</p>
            <p className="mt-1 text-xl font-bold text-[var(--color-ink)]">2</p>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle title="Financial story" body="Read this first. It explains the score in plain words." />
        <div className="rounded-3xl bg-[var(--color-surface-alt)] p-4 text-sm leading-7 text-[var(--color-ink)]">
          {trader.story}
        </div>
        <div className="grid gap-3">
          {[
            ["Identity verified", "Biometric and market profile confirmed."],
            ["No default history", "Clean record across prior facilities."],
            ["Seasonal concentration", "Revenue rises around fabric demand spikes."],
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
  return (
    <AppShell title="Active Loans" subtitle="Facilities and repayment status" navKind="lender" current="/lender/loans">
      <Card className="space-y-2 bg-[var(--color-surface-alt)]">
        <SectionTitle title="How to read this page" body="Green is healthy. Amber needs review. Open a row for details." />
      </Card>
      <div className="grid gap-3">
        {[
          ["Mama Titi", "NGN 150,000", "Performing"],
          ["Musa Phones", "NGN 500,000", "Performing"],
          ["Chika Foods", "NGN 50,000", "Needs review"],
        ].map(([name, amount, status]) => (
          <ActionTile
            key={name}
            icon={Landmark}
            title={name}
            body={`${amount} - ${status}`}
            href="/lender/loans/demo-loan"
            tone={status === "Needs review" ? "gold" : "primary"}
          />
        ))}
      </div>
    </AppShell>
  );
}

export function LoanDetailScreen({ loanId }) {
  return (
    <AppShell title="Loan Detail" subtitle={`Facility reference: ${loanId}`} navKind="lender" current="/lender/loans">
      <Card className="space-y-4">
        <SectionTitle title="Facility summary" body="Repayment health, transfer reference, and risk alerts live here." />
        <div className="grid gap-3">
          {[
            ["Disbursed", "NGN 150,000"],
            ["Outstanding", "NGN 78,000"],
            ["Transfer ref", "SQD-DEMO-001"],
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
  return (
    <AppShell title="Risk Alerts" subtitle="Daily scan output from the risk adapter" navKind="lender" current="/lender/risk-alerts">
      <Card className="space-y-2 bg-[var(--color-surface-alt)]">
        <SectionTitle title="How to read this page" body="High means act now. Medium means watch." />
      </Card>
      <div className="grid gap-3">
        {summary.alerts.map((alert) => (
          <div key={alert.trader} className="rounded-[26px] border border-[var(--color-border)] bg-white p-5 shadow-[0_10px_28px_rgba(7,24,47,0.05)]">
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
        ))}
      </div>
    </AppShell>
  );
}

export function LenderSettingsScreen() {
  return (
    <AppShell title="Lender Settings" subtitle="Institution and alert preferences" navKind="lender" current="/lender/settings">
      <Card className="space-y-4">
        <PageIntro
          title="Portal defaults"
          body="This page keeps lender auth and alerts in one place."
        />
        <ActionTile
          icon={LineChart}
          title="Daily risk email"
          body="Receive the risk scan summary each morning."
        />
      </Card>
    </AppShell>
  );
}
