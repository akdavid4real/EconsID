# EconID Working Rules

- Keep the repo demo-first. Favor believable product flow over enterprise completeness.
- Keep all business logic in Next.js services and route handlers.
- Use Supabase for infrastructure only: auth, database, and image storage.
- Keep SquadCo access behind adapter modules in `src/server/adapters`.
- Reuse shared UI primitives and route shells before adding page-local patterns.
- Preserve one score scale across the app: `0-850`.
- Prefer skeletons and seeded demo data over broken live dependencies.
