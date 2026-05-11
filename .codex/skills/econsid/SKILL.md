# EconID Repo Skill

## Purpose

Use this skill when working inside the EconID repo.

## Product defaults

- This is a hackathon demo product.
- The demo flow matters more than full backend completeness.
- Keep the narrative coherent across landing, onboarding, trader, and lender views.
- The score system is always `0-850`.

## Architecture defaults

- Next.js owns all application and business logic.
- Supabase is infrastructure only: auth, database, image storage.
- Do not push business rules into Supabase RPC or database-side logic unless explicitly asked.
- SquadCo and AI integrations must sit behind adapters in `src/server/adapters`.

## UI defaults

- Reuse the shared shells and primitives before creating page-local variants.
- Keep a restrained palette: navy primary, green trust/status, light surfaces, subtle borders.
- Prefer skeletons over spinners.
- Use dense operational layouts for lender views and clearer storytelling layouts for public/trader views.

## Implementation defaults

- Put route handlers under `src/app/api`.
- Keep seeded demo data available so the app remains explorable without live credentials.
- Normalize provider responses into app-owned shapes before they reach UI code.
- Prefer feature modules under `src/features/*` instead of embedding page logic in route files.

## Environment defaults

- `ECONID_DEMO_MODE=true` should make incomplete integrations fail soft.
- Never expose service-role credentials to client code.
