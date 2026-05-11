# EconID

EconID is a demo-first Next.js 16 application for turning informal trader activity into a usable financial identity for credit, insurance, and lender review.

## Stack

- Next.js 16 App Router
- JavaScript
- Tailwind CSS v4
- pnpm
- Supabase client helpers
- SquadCo sandbox adapter boundaries

## Local setup

1. Install dependencies:
   ```bash
   corepack pnpm install
   ```
2. Copy `.env.example` to `.env.local` and fill in the keys you have.
3. Run the app:
   ```bash
   corepack pnpm dev
   ```

`ECONID_DEMO_MODE=true` keeps the scaffold usable when external services are not configured yet.

## Scripts

- `pnpm dev` - start local dev server
- `pnpm build` - production build
- `pnpm start` - run production server
- `pnpm lint` - run ESLint
- `pnpm format` - run Prettier
- `pnpm check` - lint then build

## App shape

- Public: landing, onboarding, share profile, lender login
- Trader: dashboard, identity, insurance, credit, transactions, settings
- Lender: dashboard, traders, trader detail, loans, risk alerts, settings
- APIs: onboard, score, insurance, credit, Squad webhook, risk scan

## Conventions

- Product logic lives in Next.js only.
- Supabase is treated as infrastructure, not the business-logic layer.
- All external providers are wrapped in app-owned adapters.
- Demo-safe routes should still render meaningful seeded data.
- The score scale is fixed at `0-850`.

## Reference material

- `docs/references/plan/EconID_Hackathon_Plan.docx`
- `docs/references/mockups/*`
- `.codex/skills/econsid/SKILL.md`
