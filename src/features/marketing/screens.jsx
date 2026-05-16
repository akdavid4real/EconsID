import {
  BadgeCheck,
  Building2,
  Landmark,
  Phone,
  ShieldCheck,
  Store,
  WalletCards,
} from "lucide-react";
import { MarketingShell } from "@/components/shells/app-shells";
import {
  ActionTile,
  Badge,
  Button,
  Card,
  PageIntro,
  SectionTitle,
} from "@/components/ui/primitives";
import { demoData } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/format";
import { LenderLoginForm } from "@/features/auth/lender-login-form";
import { TraderLoginForm } from "@/features/auth/trader-login-form";
import { OnboardingClient } from "@/features/marketing/onboarding-client";

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--color-shell)] text-white shadow-lg">
        <ShieldCheck className="h-6 w-6" aria-hidden="true" />
      </span>
      <div>
        <p className="text-lg font-black tracking-tight">EconID</p>
        <p className="text-xs font-medium text-[var(--color-muted)]">Proof from daily trade</p>
      </div>
    </div>
  );
}

function MarketVisual({ trader }) {
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-[var(--color-shell)] p-5 text-white shadow-[0_24px_60px_rgba(7,24,47,0.22)]">
      <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(90deg,rgba(25,181,107,0.4),rgba(246,184,63,0.34))]" />
      <div className="relative space-y-5">
        <div className="flex items-center justify-between">
          <Badge tone="gold">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Verified trader
          </Badge>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">0-850</span>
        </div>
        <div className="grid grid-cols-[1fr_auto] items-end gap-4">
          <div>
            <p className="text-sm text-white/85">Starter trust score view</p>
            <p className="mt-1 text-6xl font-black tracking-tight">{trader.score}</p>
          </div>
          <div className="grid h-24 w-24 place-items-center rounded-full bg-white/10">
            <Store className="h-11 w-11 text-[var(--color-gold)]" aria-hidden="true" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["Pays weekly", "Stock moving", "No gaps"].map((item) => (
            <div key={item} className="rounded-2xl bg-white/10 p-3 text-center text-xs font-bold">
              {item}
            </div>
          ))}
        </div>
        <div className="rounded-3xl bg-white p-4 text-[var(--color-ink)]">
          <p className="text-sm font-bold">What EconID can unlock</p>
          <p className="mt-1 text-2xl font-black">{formatCurrency(trader.availableCredit)}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Credit and cover open once your trade activity is saved.
          </p>
        </div>
      </div>
    </div>
  );
}

export function LandingScreen() {
  const trader = demoData.trader;

  return (
    <MarketingShell>
      <header className="flex items-center justify-between">
        <BrandMark />
        <div className="flex items-center gap-3">
          <Button as="link" href="/login" tone="secondary" className="min-h-10 px-4" icon={false}>
            Trader login
          </Button>
          <Button as="link" href="/lender/login" tone="secondary" className="min-h-10 px-4" icon={false}>
            Lenders
          </Button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-6">
          <PageIntro
            eyebrow="For market traders"
            title="Show your trade. Get a score."
            body="EconID turns your everyday trade activity into one simple profile lenders and insurers can actually use."
            actions={
              <>
                <Button as="link" href="/onboard" tone="gold">
                  Start with phone number
                </Button>
                <Button as="link" href="/login" tone="secondary">
                  Trader login
                </Button>
              </>
            }
          />
          <div className="grid gap-3">
            <ActionTile
              icon={Phone}
              title="Start with your phone"
              body="Enter your number, then verify the code."
              href="/onboard"
            />
            <ActionTile
              icon={ShieldCheck}
              title="Already have an account?"
              body="Sign in to open your dashboard and continue from saved data."
              href="/login"
            />
            <ActionTile
              icon={ShieldCheck}
              title="Add cover"
              body="Pick a simple daily plan that matches your shop."
              href="/dashboard/insurance"
              tone="gold"
            />
            <ActionTile
              icon={Landmark}
              title="Borrow with proof"
              body="Lenders review your score, profile, and saved activity in one place."
              href="/lender/login"
            />
          </div>
        </div>
        <MarketVisual trader={trader} />
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ["1. Verify", "Use your phone and simple business details."],
          ["2. Build", "Your score grows from real payments."],
          ["3. Unlock", "Cover and credit open as your score rises."],
        ].map(([title, body]) => (
        <Card key={title} className="space-y-2">
          <SectionTitle title={title} body={body} />
        </Card>
        ))}
      </section>
    </MarketingShell>
  );
}

export function OnboardingScreen({ step }) {
  const stepMeta = demoData.onboardingSteps[step];

  return (
    <MarketingShell>
      <div className="mx-auto w-full max-w-xl space-y-5">
        <div className="flex items-center justify-between">
          <BrandMark />
          <Button as="link" href="/" tone="secondary" className="min-h-10 px-4" icon={false}>
            Close
          </Button>
        </div>

        <div className="rounded-[30px] bg-[var(--color-shell)] p-4 text-white shadow-[0_20px_54px_rgba(7,24,47,0.18)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                Step {step + 1} of 4
              </p>
              <p className="mt-1 text-2xl font-black">{stepMeta.title}</p>
              <p className="mt-1 text-sm text-white/85">{stepMeta.caption}</p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
              {step < 2 ? <Phone className="h-6 w-6" /> : <Store className="h-6 w-6" />}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {demoData.onboardingSteps.map((item, index) => (
              <div
                key={item.slug}
                className={`h-2 rounded-full ${index <= step ? "bg-[var(--color-gold)]" : "bg-white/15"}`}
              />
            ))}
          </div>
        </div>

        <Card className="space-y-5">
          <OnboardingClient step={step} />
        </Card>
        <Card className="space-y-3 bg-[var(--color-surface-alt)]">
          <SectionTitle title="Already registered?" body="Use your trader account to sign in instead of starting over." />
          <Button as="link" href="/login" tone="secondary" className="w-full justify-center" icon={false}>
            Trader login
          </Button>
        </Card>
      </div>
    </MarketingShell>
  );
}

export function ShareProfileScreen({ traderId }) {
  return (
    <MarketingShell>
      <div className="mx-auto grid max-w-4xl gap-5">
        <BrandMark />
        <Card className="relative overflow-hidden !bg-[var(--color-shell)] text-white">
          <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(90deg,rgba(25,181,107,0.3),rgba(184,135,43,0.25))]" />
          <div className="relative grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Badge tone="gold">Shared profile</Badge>
              <p className="mt-4 text-sm text-white/80">{traderId}</p>
              <p className="mt-2 text-6xl font-black">{demoData.trader.score}</p>
              <p className="text-sm text-white/85">Trust score out of 850</p>
              <div className="mt-5 grid gap-2">
                <div className="rounded-2xl bg-white/10 p-3 text-sm">
                  Share this with a lender
                </div>
                <div className="rounded-2xl bg-white/10 p-3 text-sm">
                  They can open the score quickly
                </div>
                <div className="rounded-2xl bg-white/10 p-3 text-sm">
                  They do not need extra forms first
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-5 text-[var(--color-ink)]">
              <SectionTitle title={`${demoData.trader.name}'s financial story`} body={demoData.trader.story} />
              <div className="mt-4 grid gap-2">
                {demoData.trader.identityBreakdown.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl bg-[var(--color-surface-alt)] p-3">
                    <span className="text-sm text-[var(--color-muted)]">{label}</span>
                    <span className="font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MarketingShell>
  );
}

export function LenderLoginScreen() {
  return (
    <MarketingShell>
      <div className="mx-auto w-full max-w-xl space-y-5">
        <BrandMark />
        <Card className="space-y-5">
          <PageIntro
            eyebrow="Lender access"
            title="Open a trader profile."
            body="Sign in to review saved trader profiles, score snapshots, requests, and provider activity."
          />
          <LenderLoginForm />
        </Card>
        <ActionTile
          icon={Building2}
          title="Lender workspace"
          body="Use a lender or admin account to open the saved workspace."
        />
      </div>
    </MarketingShell>
  );
}

export function TraderLoginScreen() {
  return (
    <MarketingShell>
      <div className="mx-auto w-full max-w-xl space-y-5">
        <BrandMark />
        <Card className="space-y-5">
          <PageIntro
            eyebrow="Trader access"
            title="Open your dashboard."
            body="Sign in with the trader account you created during onboarding to continue from your saved EconID data."
          />
          <TraderLoginForm />
        </Card>
        <ActionTile
          icon={Phone}
          title="Need an account first?"
          body="Start onboarding to create your trader profile and sign-in details."
          href="/onboard"
        />
      </div>
    </MarketingShell>
  );
}
