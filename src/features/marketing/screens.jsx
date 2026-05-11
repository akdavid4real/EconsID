import {
  BadgeCheck,
  Building2,
  Landmark,
  LockKeyhole,
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
  Field,
  Input,
  PageIntro,
  SectionTitle,
  Select,
} from "@/components/ui/primitives";
import { demoData } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/format";

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
            <p className="text-sm text-white/70">Mama Titi trust score</p>
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
          <p className="text-sm font-bold">Next unlocked action</p>
          <p className="mt-1 text-2xl font-black">{formatCurrency(trader.availableCredit)}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Working capital offer ready for review.
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
        <Button as="link" href="/lender" tone="secondary" className="min-h-10 px-4" icon={false}>
          Lenders
        </Button>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-6">
          <PageIntro
            eyebrow="For market traders"
            title="Show your trade. Get a score."
            body="EconID turns the money already moving through your shop into one simple profile for cover and credit."
            actions={
              <>
                <Button as="link" href="/onboard" tone="gold">
                  Start with phone number
                </Button>
                <Button as="link" href="/share/trd-mama-titi" tone="secondary">
                  See sample profile
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
              title="Add cover"
              body="Pick a daily plan that matches your shop."
              href="/dashboard/insurance"
              tone="gold"
            />
            <ActionTile
              icon={Landmark}
              title="Borrow with proof"
              body="Lenders see your score and recent trade history."
              href="/lender"
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
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                Step {step + 1} of 4
              </p>
              <p className="mt-1 text-2xl font-black">{stepMeta.title}</p>
              <p className="mt-1 text-sm text-white/70">{stepMeta.caption}</p>
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
          {step === 0 ? (
            <div className="grid gap-4">
              <Field label="Phone Number">
                <Input placeholder="+234 801 234 5678" inputMode="tel" />
              </Field>
              <Button as="link" href="/onboard/verify" tone="gold">
                Send OTP
              </Button>
              <p className="text-sm text-[var(--color-muted)]">We only use this to open your account.</p>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-4">
              <Field label="6-digit OTP">
                <Input placeholder="123456" inputMode="numeric" />
              </Field>
              <Button as="link" href="/onboard/profile" tone="gold">
                Verify phone
              </Button>
              <p className="text-sm text-[var(--color-muted)]">Check your SMS and enter the code here.</p>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-4">
              <Field label="Full Name">
                <Input placeholder="Mama Titi" />
              </Field>
              <Field label="Market or Business Name">
                <Input placeholder="Balogun Market Stall A1" />
              </Field>
              <Field label="Trade Category">
                <Select defaultValue="fabric">
                  <option value="fabric">Fabric</option>
                  <option value="electronics">Electronics</option>
                  <option value="food">Food</option>
                </Select>
              </Field>
              <div className="flex gap-3 rounded-3xl bg-[var(--color-gold-soft)] p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white text-[#7a5512]">
                  <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="text-sm leading-6 text-[#6c4d14]">
                  We use your trade activity to build your score. Nothing else.
                </p>
              </div>
              <Button as="link" href="/onboard/account" tone="gold">
                Continue
              </Button>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-4">
              <Field label="Bank Name">
                <Input placeholder="Wema Bank" />
              </Field>
              <Field label="Account Number">
                <Input placeholder="0123456789" inputMode="numeric" />
              </Field>
              <div className="rounded-3xl bg-[var(--color-shell)] p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">
                  Squad sandbox account
                </p>
                <p className="mt-2 text-4xl font-black">{demoData.trader.virtualAccount}</p>
                <p className="mt-2 text-sm text-white/75">This is where customer payments will land.</p>
              </div>
              <Button as="link" href="/dashboard" tone="gold">
                Finish setup
              </Button>
            </div>
          ) : null}
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
        <Card className="overflow-hidden bg-[var(--color-shell)] text-white">
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Badge tone="gold">Shared profile</Badge>
              <p className="mt-4 text-sm text-white/65">{traderId}</p>
              <p className="mt-2 text-6xl font-black">{demoData.trader.score}</p>
              <p className="text-sm text-white/70">Trust score out of 850</p>
              <div className="mt-5 grid gap-2">
                <div className="rounded-2xl bg-white/10 p-3 text-sm">
                  Show this to a lender
                </div>
                <div className="rounded-2xl bg-white/10 p-3 text-sm">
                  They can check your score
                </div>
                <div className="rounded-2xl bg-white/10 p-3 text-sm">
                  They do not need your forms
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
            body="See the score, recent payments, and the next action in one place."
          />
          <Field label="Work Email">
            <Input placeholder="credit@institution.ng" />
          </Field>
          <Field label="Password">
            <Input placeholder="Enter password" type="password" />
          </Field>
          <Button as="link" href="/lender">
            Continue to portal
          </Button>
        </Card>
        <ActionTile
          icon={Building2}
          title="Demo lender view"
          body="Use seeded traders and loan health while auth is wired."
          href="/lender"
        />
      </div>
    </MarketingShell>
  );
}
