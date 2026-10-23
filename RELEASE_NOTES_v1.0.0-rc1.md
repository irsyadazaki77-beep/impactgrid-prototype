# ImpactGrid v1.0.0-rc1

**Status:** Release candidate for limited public demo as a simulated proposal prototype.  
**Release commit SHA:** `6af683e959af9eefd4bcfd0a7812108c62fe1ec9`

## Included

- Light Enterprise is the first-run display; Dark Mode remains available.
- Demo preflight and reset return the presentation to the deterministic local preset.
- Guided Pitch follows the eight-stage, 7-minute director script.
- Offline local simulation and local AI response remain the default; provider-backed AI is optional.
- Dark amber theme surfaces use shared semantic warning tokens; mobile navigation stays above the sticky header while open.
- Connectivity status probes the current demo host and distinguishes host reachability from the app's offline local behavior. The map reports unavailable tiles separately.
- Production build keeps feature modules lazy-loaded and static assets under `dist`.
- Vercel configuration explicitly sets `npm ci`, `npm run build`, `dist`, and the SPA fallback rewrite.

## Evidence and limitations

See [RELEASE_CANDIDATE_REPORT.md](./RELEASE_CANDIDATE_REPORT.md) for command output, browser checks, findings, severity, and final release checklist. The RC is not a BTS control system and contains no operational site baseline or verified pilot outcomes. Financial figures remain assumptions/sensitivity calculations. Vercel configuration was reviewed and the production build was exercised with local Vite Preview; no public Vercel deployment or custom domain was created in this audit.

## Deploy the static demo

1. Import the repository into Vercel and set the repository root as the project root.
2. Keep the `vercel.json` install/build/output settings: `npm ci`, `npm run build`, and `dist`.
3. Do not set a frontend provider key or put secrets in `VITE_*` environment variables. The static pitch and local copilot require no environment variables.
4. Verify the deployment preview: load `/`, open `/presentation/refresh-check` directly and refresh, inspect local diagrams/logo, confirm offline fallback, and run the presentation preflight.
5. Share only as a limited prototype demo after reviewing the actual Preview URL. The backend AI proxy is not deployed by this static configuration and must remain optional/off.

The current Vite version requires Node.js 20.19+ or 22.12+; the audited workspace ran Node.js 24.18.0. See the [Vite Node.js compatibility note](https://vite.dev/guide/) and [Vercel rewrite configuration](https://vercel.com/docs/routing/rewrites).

## Roll back

Use `vercel rollback` to restore the previous production deployment, then verify the domain. Use `vercel rollback status` to confirm completion. Alternatively, redeploy the prior known-good commit. A rollback restores the prior static frontend; it does not deploy or restore an AI backend. See [Vercel rollback guidance](https://vercel.com/docs/cli/rollback).
