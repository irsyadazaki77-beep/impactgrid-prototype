# ImpactGrid v1.0.0-rc1 — Final Release Audit

**Audit date:** 23 October 2026  
**Scope:** release candidate in this workspace; Chromium E2E against a production Vite build.  
**Release artifact commit:** `6af683e959af9eefd4bcfd0a7812108c62fe1ec9`

## Decision

**GO for a local, offline-capable simulated presentation after completing demo preflight. NOT READY for a publicly hosted release until a real Vercel Preview URL passes the deployment smoke checks below.** No public deployment was created or inspected in this audit. Do not enable the optional provider-backed AI proxy on a public host: the current proxy is unauthenticated and the static Vercel configuration does not deploy it. This is a proposal prototype; it has no verified site baseline, pilot outcomes, real SLA, live network connection, or BTS controls.

## Findings and changes

| Severity | Finding | Resolution / status |
|---|---|---|
| P1 | Dark Mode ESG hero had poor foreground contrast. | Matched dark warning surface, border, and foreground to shared semantic theme tokens; automated contrast assertion and screenshot inspection pass. |
| P1 | Guided Pitch timing and script cues needed alignment; modal shortcuts could conflict with the pitch. | Eight-stage script and UI cues now align with the official 7-minute script. Preflight is keyboard operable, requires all confirmations, pitch starts in Light mode, and modal state suppresses app shortcuts. |
| P1 | Public AI proxy would be unsafe to expose without caller authentication and deployment controls. | Default server bind is loopback; server validates request size/model, applies in-memory rate limiting and allowed origins, and returns generic provider errors. Public proxy deployment remains blocked. CORS alone is not authentication. |
| P1 | Offline/host availability and map-tile failure needed clearer status. | Same-origin host reachability probe has timeout/cleanup and distinguishes host reachability from local simulation. Browser offline and unavailable map tiles have separate fallback messages; app simulation remains local. |
| P1 | Responsive mobile drawer was obscured by the sticky header in an earlier E2E run. | Raised drawer/toggle stacking order; mobile drawer navigation is now exercised by E2E. |
| P1 | Vercel static SPA settings and direct-route refresh behavior needed verification. | Added explicit install/build/output and SPA rewrite configuration. Production preview opens and refreshes a client route with local assets. Actual Vercel deployment remains unverified. |
| P1 | The mobile header status ticker clipped its indicators, and its Dark Mode Menu button used a light foreground on a white surface. | Phone ticker now stacks the visible provenance indicators, the dark menu uses the dark theme surface, and E2E asserts no ticker clipping plus the expected dark menu colors. |
| P2 | No screenshot baseline existed for visual-regression comparison. | Captured and reviewed 17 Playwright screenshot artifacts across light/dark, pitch, and requested viewport sizes. No baseline was invented or updated. |
| P2 | Existing lockfile was incomplete for reproducible installation. | `npm ci` completed from the refreshed lockfile; `npm audit` found no known vulnerabilities. |

No proposal amount was changed in this phase. Previously audited financial outputs remain sensitivity calculations under stated assumptions, not measured savings or forecasts. Company-level public figures do not constitute a BTS/site baseline. Synthetic inputs and model outputs remain labeled as simulation/proposal data.

## Actual validation

| Command / inspection | Actual result |
|---|---|
| `npm ci` | **PASS** — added 170 packages; audited 171 packages; 0 vulnerabilities. |
| `npm run build` | **PASS** — Vite 8.3.5 transformed 2,576 modules and emitted production assets. Also invoked successfully as part of `npm run test:e2e`. |
| `npm test` | **PASS** — 5 test files, 22 tests passed (latest run after the final map status change). |
| `npm run test:e2e` | **PASS** — production build then 12/12 Chromium E2E tests passed. Covers navigation/modules, themes, viewport overflow, responsive drawer, SPA route refresh/assets, host/offline/map fallback, all 8 pitch stages under virtual time, AI failure fallback, reset/emergency flow, dialogs and report action. |
| `npm audit` | **PASS** — `found 0 vulnerabilities`. |
| `git diff --check` | **PASS** — no whitespace errors; Git emitted line-ending normalization warnings for LF files on Windows. |
| `vercel.json` parse | **PASS** — valid JSON; explicit `npm ci`, `npm run build`, `dist`, and catch-all `index.html` rewrite. |
| Production bundle secret-name scan | **PASS** — no provider-key variable name, direct Gemini URL, or `VITE_*KEY/TOKEN` reference in `src` or `dist`. Secret value scanning of the entire Git history was not performed. |
| Browser viewport/theme inspection | **PASS with scope limits** — screenshots captured for 1366×768, 1920×1080, 768×1024 and 390×844 in both themes, plus pitch. Reviewed 1366×768 Light dashboard, 1366×768 Dark ESG, and 390×844 Dark dashboard. Playwright ran Chromium only; no physical display/device verification. |
| SPA production preview | **PASS locally** — direct client route, refresh, and local image asset loading work under Vite Preview. This does not verify a hosted Vercel URL or CDN behavior. |

Performance observations from the final E2E local run: module navigation measured about 376–465 ms; initial JavaScript transfer about 103,788 bytes (encoded); DOMContentLoaded/load about 65 ms and LCP about 476 ms. These are one local Chromium run, not production guarantees. Feature modules remain lazy-loaded. The seven-minute guided pitch was advanced with a virtual clock to 420 seconds; no spoken rehearsal was performed. The UI has no BTS control path.

## Release checklist

| Check | Status | Evidence / boundary |
|---|---|---|
| Clean install, production build, unit/integration tests | PASS | `npm ci`, `npm run build`, and `npm test` outputs above. |
| Browser E2E | PASS | `npm run test:e2e`, 12/12. |
| Dependency scan | PASS | `npm audit`, 0 known vulnerabilities. |
| Light default, Dark Mode, responsive screens | PASS | Automated checks and 17 screenshot artifacts; Chromium viewports only. |
| Eight-stage seven-minute pitch | PASS (automated timing) | Script/timing assertions plus virtual 420-second browser run; spoken delivery not tested. |
| Offline core simulation and AI failure fallback | PASS | Local mode works without provider; failed optional proxy request falls back locally. Internet tiles/source links remain unavailable offline. |
| Simulation reset, emergency scenario, navigation, modals | PASS | Covered by passing E2E suite; simulation remains non-operational. |
| Financial/QoS/ESG claims and synthetic-data labeling | PASS with limits | Report and UI distinguish proposals, assumptions and public company figures from verified site/pilot results. |
| Actual Vercel Preview URL, SPA refresh, CDN asset behavior | BLOCKED / not run | No Vercel deployment credentials or URL used; perform preview URL smoke check before sharing publicly. |
| Public provider AI proxy | BLOCKED | No caller authentication; static Vercel configuration does not deploy the proxy. Keep it disabled/offline for demo. |
| Spoken rehearsal and projector/device inspection | NOT TESTED | Perform a timed human rehearsal and inspect actual event display before the competition. |

## Outstanding issues by severity

- **P0: none found in the tested local demo path.**
- **P1: hosted deployment is unverified.** Run Vercel Preview smoke checks (root, direct route refresh, assets, offline fallback) and inspect the actual URL before distributing it.
- **P1: public AI proxy is not cleared.** It has no caller authentication; do not expose it. Use built-in local copilot for this release candidate.
- **P2: human presentation and physical projector checks remain.** Automated virtual timing cannot establish speaker pace or venue readability.
- **P2: no committed visual baseline exists.** Review the generated screenshots manually; a baseline should only be introduced after deliberate approval of the current UI.

## Deployment and rollback

### Local demo

Use Node.js 20.19+ or 22.12+ (audited workspace: Node.js 24.18.0), then run:

```bash
npm ci
npm run dev
```

Use **Demo lokal** and built-in AI fallback. No provider key is needed. Complete the presentation preflight and reset demo state before beginning. Internet-backed map tiles and source links are optional.

### Vercel static preview

Import the repository with its root as the project root. Keep the checked-in `vercel.json` settings: `npm ci`, `npm run build`, and `dist`. Do not configure frontend provider secrets or `VITE_*` key/token variables. After Vercel creates a Preview URL, directly open and refresh a client route, verify local SVG/logo assets, and check the offline demo fallback before sharing. This audit did not deploy or claim a public URL. See [Vercel rewrites](https://vercel.com/docs/routing/rewrites) and [Vite Node compatibility](https://vite.dev/guide/).

The proxy is a separate local Express process (`npm run dev:server`) and is not included in the static deployment. Do not expose it publicly until it has caller authentication, HTTPS, deployment-appropriate CORS/rate limits, and environment-specific failure testing.

### Rollback

For Vercel, use `vercel rollback` to restore the previous production deployment, then verify the domain; alternatively redeploy the previous known-good commit. A static rollback does not deploy or restore the AI proxy. For the local demo, restore the previous repository revision and run `npm ci`. See [Vercel rollback guidance](https://vercel.com/docs/cli/rollback).

## Reproduction commands

```bash
npm ci
npm run build
npm test
npm run test:e2e
npm audit
```
