import {
  Camera,
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
  Select,
  StatCard,
} from "@/components/ui/primitives";
import { demoData } from "@/lib/demo-data";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";

const trader = demoData.trader;

function HeroAccountCard() {
  return (
    <Card className="relative overflow-hidden border-[var(--color-border)] bg-white">
      <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(90deg,rgba(63,125,82,0.1),rgba(184,135,43,0.1))]" />
      <div className="relative space-y-5">
        <div className="flex items-center justify-between">
          <Badge tone="gold">
            <Store className="h-3.5 w-3.5" aria-hidden="true" />
            {trader.market}
          </Badge>
          <Badge tone="positive">Active</Badge>
        </div>
        <div>
          <p className="text-sm text-[var(--color-muted)]">Your payment account</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-[var(--color-primary-strong)]">{trader.virtualAccount}</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">{trader.name} Fabrics Enterprise</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[var(--color-surface-alt)]/80 p-3">
            <p className="text-xs text-[var(--color-muted)]">This week</p>
            <p className="mt-1 text-lg font-semibold text-[var(--color-primary-strong)]">{formatCompactCurrency(trader.weeklyRevenue)}</p>
          </div>
          <div className="rounded-2xl bg-[var(--color-surface-alt)]/80 p-3">
            <p className="text-xs text-[var(--color-muted)]">Credit ready</p>
            <p className="mt-1 text-lg font-semibold text-[var(--color-primary-strong)]">{formatCompactCurrency(trader.availableCredit)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function SummaryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <StatCard icon={LineChart} label="Weekly sales" value={formatCompactCurrency(trader.weeklyRevenue)} hint="Steady inflows" />
      <StatCard icon={TrendingUp} label="90-day inflow" value={formatCompactCurrency(trader.inflow90d)} hint="+12% growth" />
      <StatCard icon={ShieldCheck} label="Cover" value="Active" hint={trader.coverage.activePlan} />
      <StatCard icon={Landmark} label="Credit" value={formatCompactCurrency(trader.availableCredit)} hint={trader.trustBand} />
    </div>
  );
}

export function TraderHomeScreen() {
  return (
    <AppShell title={`Hi, ${trader.name}`} subtitle={`${trader.category} in ${trader.market}`} current="/dashboard">
      <HeroAccountCard />
      <div className="grid gap-3">
        <Card className="space-y-3 border-[var(--color-border)] bg-[var(--color-surface-alt)]/80">
          <SectionTitle title="Start here" body="Use these three actions in order. That is the whole flow." />
          <div className="grid gap-2">
            <div className="flex items-center gap-3 rounded-2xl bg-[rgba(255,255,255,0.72)] p-3">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--color-accent-soft)] text-[#21593a] font-semibold">1</span>
              <p className="text-sm text-[var(--color-ink)]">Check your score and what it unlocks.</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-[rgba(255,255,255,0.72)] p-3">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--color-accent-soft)] text-[#21593a] font-semibold">2</span>
              <p className="text-sm text-[var(--color-ink)]">Add cover if you want protection.</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-[rgba(255,255,255,0.72)] p-3">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--color-accent-soft)] text-[#21593a] font-semibold">3</span>
              <p className="text-sm text-[var(--color-ink)]">Apply for cash after your score is ready.</p>
            </div>
          </div>
        </Card>
        <ActionTile
          icon={ReceiptText}
          title="See my score"
          body="Check what EconID knows about your trade."
          href="/dashboard/identity"
        />
        <ActionTile
          icon={ShieldCheck}
          title="My cover"
          body={`${formatCurrency(trader.coverage.amount)} protection, ${trader.coverage.daysCovered} days covered.`}
          href="/dashboard/insurance"
          tone="gold"
        />
        <ActionTile
          icon={WalletCards}
          title="Apply for cash"
          body={`${formatCurrency(trader.availableCredit)} available from your score.`}
          href="/dashboard/credit"
        />
      </div>
      <SummaryGrid />
      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <SectionTitle title="Money coming in" body="These payments build your score." />
          <Button as="link" href="/dashboard/transactions" tone="secondary" className="min-h-10 px-4" icon={false}>
            All
          </Button>
        </div>
        <div className="grid gap-3">
          {trader.inflows.map((inflow) => (
            <div key={`${inflow.name}-${inflow.when}`} className="flex items-center gap-3 rounded-3xl bg-[var(--color-surface-alt)]/80 p-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--color-accent-soft)]/90 text-[#21593a]">
                <Send className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{inflow.name}</p>
                <p className="truncate text-sm text-[var(--color-muted)]">{inflow.method} - {inflow.when}</p>
              </div>
              <p className="font-semibold text-[var(--color-primary-strong)]">{formatCurrency(inflow.amount)}</p>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}

export function IdentityScreen() {
  return (
    <AppShell title="My EconID" subtitle="Score, proof, and shareable profile" current="/dashboard">
      <ProgressRing score={trader.score} label="Trust score" />
      <Card className="space-y-4">
        <SectionTitle title="Why this score is strong" body={trader.story} />
        <div className="grid gap-2">
          {trader.identityBreakdown.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
              <span className="text-sm text-[var(--color-muted)]">{label}</span>
              <span className="font-bold">{value}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="space-y-4 bg-[var(--color-shell)] text-white">
        <SectionTitle tone="dark" title="Share this link" body="A lender can open it and see the score straight away." />
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
  return (
    <AppShell title="Protection" subtitle="Daily cover for stock, stall, and income" current="/dashboard/insurance">
      <Card className="space-y-5 bg-[var(--color-shell)] text-white">
        <div className="flex items-center justify-between">
          <Badge tone="gold">Active policy</Badge>
          <ShieldCheck className="h-8 w-8 text-[var(--color-gold)]" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm text-white/65">Your cover now</p>
          <p className="mt-1 text-5xl font-black">{formatCurrency(trader.coverage.amount)}</p>
          <p className="mt-2 text-sm text-white/75">{trader.coverage.daysCovered} days covered - {trader.coverage.activePlan}</p>
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
              <p className="text-xl font-black">{formatCurrency(plan.price)}<span className="text-sm text-[var(--color-muted)]">/day</span></p>
            </div>
            <div className="mt-4 h-2 rounded-full bg-[var(--color-surface-alt)]">
              <div className="h-2 rounded-full bg-[var(--color-accent)]" style={{ width: plan.status === "locked" ? "35%" : "78%" }} />
            </div>
            {plan.status === "recommended" ? <Badge tone="gold">Best match</Badge> : null}
            {plan.status === "locked" ? <LockedOverlay title="Unlock at score 800" body="Keep collecting payments through EconID." /> : null}
          </div>
        ))}
      </div>
    </AppShell>
  );
}

export function InsuranceSubscribeScreen() {
  return (
    <AppShell title="Choose Cover" subtitle="Squad sandbox payment handoff" current="/dashboard/insurance">
      <Card className="space-y-4">
        <SectionTitle title="Stall + Stock cover" body="This is the best fit for your score. The live version opens Squad checkout." />
        <div className="rounded-3xl bg-[var(--color-gold-soft)] p-4">
          <p className="text-sm font-bold text-[#7a5512]">Daily premium</p>
          <p className="mt-1 text-4xl font-black">{formatCurrency(300)}</p>
        </div>
        <Button as="link" href="/dashboard/insurance" tone="gold">
          Start cover
        </Button>
      </Card>
    </AppShell>
  );
}

export function InsuranceClaimScreen() {
  return (
    <AppShell title="File a Claim" subtitle="Simple report with photo evidence" current="/dashboard/insurance">
      <Card className="grid gap-4">
        <Field label="What happened?">
          <Select defaultValue="stock-loss">
            <option value="stock-loss">Stock loss</option>
            <option value="stall-damage">Stall damage</option>
            <option value="income-interruption">Income interruption</option>
          </Select>
        </Field>
        <Field label="Tell us in your words">
          <textarea className="min-h-36 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(63,125,82,0.14)]" placeholder="Example: Rain entered my stall and damaged two fabric bundles." />
        </Field>
        <label className="grid min-h-32 place-items-center rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 text-center">
          <Camera className="h-8 w-8 text-[var(--color-primary)]" aria-hidden="true" />
          <span className="mt-2 font-bold">Add photo</span>
          <span className="text-sm text-[var(--color-muted)]">Take a clear photo of the damage.</span>
          <Input type="file" className="sr-only" />
        </label>
        <Button as="link" href="/dashboard/insurance/claims/demo-claim">
          Submit claim
        </Button>
      </Card>
    </AppShell>
  );
}

export function InsuranceClaimDetailScreen({ claimId }) {
  return (
    <AppShell title="Claim Result" subtitle={`Reference: ${claimId}`} current="/dashboard/insurance">
      <Card className="space-y-5">
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[var(--color-accent-soft)] text-[#21593a]">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <SectionTitle title="Recommended for approval" body="The claim is low value, matches the active policy, and has enough evidence for the demo flow." />
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[var(--color-surface-alt)] p-4">
            <p className="text-sm text-[var(--color-muted)]">Confidence</p>
            <p className="mt-1 text-2xl font-black">88%</p>
          </div>
          <div className="rounded-2xl bg-[var(--color-surface-alt)] p-4">
            <p className="text-sm text-[var(--color-muted)]">Payout</p>
            <p className="mt-1 text-2xl font-black">NGN 10k</p>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}

export function CreditOverviewScreen() {
  return (
    <AppShell title="Working Capital" subtitle="Credit earned from daily trade" current="/dashboard/credit">
      <Card className="space-y-5 bg-[var(--color-shell)] text-white">
        <Badge tone="gold">Tier 2 eligible</Badge>
        <div>
          <p className="text-sm text-white/65">You can apply for</p>
          <p className="mt-1 text-5xl font-black">{formatCurrency(trader.availableCredit)}</p>
          <p className="mt-2 text-sm text-white/75">Based on your score, repayment history, and active inflows.</p>
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
                <p className="mt-2 text-3xl font-black">{formatCurrency(loan.amount)}</p>
              </div>
              {loan.locked ? <LockKeyhole className="h-6 w-6 text-[var(--color-muted)]" /> : <CheckCircle2 className="h-6 w-6 text-[#21593a]" />}
            </div>
            <p className="mt-3 text-sm text-[var(--color-muted)]">{loan.status}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

export function CreditApplyScreen() {
  return (
    <AppShell title="Apply for Credit" subtitle="Review before Squad transfer" current="/dashboard/credit">
      <Card className="space-y-5">
        <SectionTitle title="Disbursement summary" body="We create the loan and send the money through Squad." />
        <div className="grid gap-3">
          <div className="flex items-center justify-between rounded-3xl bg-[var(--color-surface-alt)] p-4">
            <span className="text-sm text-[var(--color-muted)]">Approved amount</span>
            <span className="font-black">{formatCurrency(trader.availableCredit)}</span>
          </div>
          <div className="flex items-center justify-between rounded-3xl bg-[var(--color-surface-alt)] p-4">
            <span className="text-sm text-[var(--color-muted)]">Payout bank</span>
            <span className="font-black">{trader.bankName}</span>
          </div>
        </div>
        <Button as="link" href="/dashboard/credit/repay" tone="gold">
          Confirm transfer
        </Button>
      </Card>
    </AppShell>
  );
}

export function CreditRepayScreen() {
  return (
    <AppShell title="Repayment Plan" subtitle="Clear weekly installments" current="/dashboard/credit">
      <div className="grid gap-3">
        {trader.repayments.map((repayment) => (
          <div key={repayment.week} className="flex items-center gap-3 rounded-[26px] border border-[var(--color-border)] bg-white p-4 shadow-[0_12px_34px_rgba(7,24,47,0.08)]">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
              <Clock3 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold">{repayment.label}</p>
              <p className="text-sm text-[var(--color-muted)]">{repayment.week} - {repayment.state}</p>
            </div>
            <p className="font-black">{formatCurrency(repayment.amount)}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

export function TransactionsScreen() {
  return (
    <AppShell title="Transactions" subtitle="Activity feeding your score" current="/dashboard">
      <AppTable
        columns={["Person", "Channel", "Amount"]}
        rows={trader.inflows.map((item) => ({
          key: `${item.name}-${item.when}`,
          cells: [item.name, `${item.method} - ${item.when}`, formatCurrency(item.amount)],
        }))}
      />
    </AppShell>
  );
}

export function SettingsScreen() {
  return (
    <AppShell title="My Account" subtitle="Profile and payout details" current="/dashboard/settings">
      <Card className="grid gap-4">
        <Field label="Full Name">
          <Input defaultValue={trader.name} />
        </Field>
        <Field label="Market Name">
          <Input defaultValue={trader.market} />
        </Field>
        <Field label="Trade Category">
          <Input defaultValue={trader.category} />
        </Field>
        <Field label="Bank Name">
          <Input defaultValue={trader.bankName} />
        </Field>
        <Button icon={Upload}>
          Upload profile photo
        </Button>
      </Card>
    </AppShell>
  );
}
