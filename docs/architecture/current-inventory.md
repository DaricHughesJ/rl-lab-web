# Current Repository Inventory

Status: W1 substantially inventoried; external/deployed configuration still requires platform verification.

This document records the pre-migration implementation so cleanup does not depend on memory. `DELETE` is used only when references/behavior have been checked.

## Root

| Path | Current role | Classification | Notes |
| --- | --- | --- | --- |
| `.env.example` | Browser environment template | KEEP | Verified to expose only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. |
| `.github/workflows/web-ci.yml` | PR/main CI | KEEP / EXPAND | Currently npm install, lint, build only; later gates need type/tests/accessibility/visual checks. |
| `.gitignore` | Generated/local/secret exclusions | KEEP / HARDENED | Expanded during W1 for test output, environment files, runtime downloads, caches. |
| `.oxlintrc.json` | Oxlint config | KEEP / REFACTOR | Current React hook/export rules only. Extend deliberately with TypeScript migration. |
| `AGENTS.md` | Engineering/architecture guardrails | KEEP | Canonical instructions for future repo work. |
| `ARCHITECTURE.md` | Root architecture pointer | KEEP | Points to canonical docs; no competing plan documents. |
| `CONTRIBUTING.md` | Change/validation workflow | KEEP | Added during standardization. |
| `SECURITY.md` | Security/trust rules | KEEP | Added during standardization. |
| `README.md` | Project entry point | KEEP | Replaced generic Vite text with MechLab-specific guidance. |
| `index.html` | Vite HTML shell/metadata | KEEP DURING MIGRATION | Contains baseline metadata; rendering/SEO ownership moves in W8. |
| `package.json` | package/scripts | KEEP / REFACTOR | React/Vite/Supabase/Cloudflare retained; test/type tooling still to land with lockfile update. |
| `package-lock.json` | npm lockfile | KEEP | Update atomically with dependency changes; never hand-edit. |
| `tsconfig.json` | strict TypeScript migration config | KEEP | `allowJs` is temporary migration support. |
| `vite.config.js` | Vite build config | KEEP / MIGRATE TS | Minimal current config. |
| `wrangler.jsonc` | Worker/R2/static bindings | KEEP | Production-critical configuration. |

## Frontend source

| Path | Current role | Classification | Notes |
| --- | --- | --- | --- |
| `src/App.jsx` | Public site + auth orchestration + dashboard handoff | REFACTOR / SPLIT | Current monolith; route map documented separately. |
| `src/App.css` | Large global site/dashboard styling | REFACTOR / SPLIT | Design-system extraction precedes deletion. |
| `src/index.css` | global baseline | KEEP / REFACTOR | Future token/reset entry point. |
| `src/main.jsx` | bootstrap + manual `/privacy`/`/terms` dispatch | KEEP / REPLACE ROUTING | Explicit route inventory now documented. |
| `src/components/AuthModal.jsx` | sign-up/sign-in/recovery modal | KEEP / MIGRATE | Requires focus-management/accessibility validation during W9. |
| `src/components/DevelopmentRoadmap.jsx` | ecosystem/roadmap/devlog content | KEEP / MOVE | Contains product-status claims that must remain evidence-backed. |
| `src/components/DevelopmentRoadmap.css` | roadmap styles | REFACTOR | Move into feature/design ownership. |
| `src/components/InstallWizard.jsx` | install/download onboarding | KEEP / MOVE / VALIDATE CLAIMS | Contains beta signing/SmartScreen and supported-workflow claims that must match actual release state. |
| `src/components/LegalDocs.jsx` | privacy and beta terms | KEEP / MOVE / REVIEW | URLs are durable; content requires explicit product/legal review as data practices change. |
| `src/components/UserDashboard.jsx` | authenticated overview/mechanics/sessions/profile | REFACTOR / SPLIT | Current tab model maps to future `/app/*` routes. |
| `src/lib/release.js` | release constants | KEEP / MIGRATE TS | Compatibility source currently consumed by Worker/UI. |
| `src/lib/supabase.js` | browser client + auth + raw table access | KEEP / SPLIT | Exact current table/field contract documented in `current-data-contract.md`. |
| `src/contracts/release.ts` | first typed release/API contract | KEEP / EXPAND | Compile-time contract only; runtime validation still pending. |
| `src/worker.js` | trusted API/download + static fallback | KEEP / MODULARIZE | Security-sensitive; preserve current behavior with integration tests. |

## Assets

| Path | Classification | Notes |
| --- | --- | --- |
| `public/favicon.svg` | KEEP | Product favicon. |
| `public/icons.svg` | KEEP / VERIFY USAGE | SVG symbol sheet. |
| `src/assets/hero.png` | NEEDS VALIDATION | No filename reference found in current indexed source search; do not delete until final reference/build check. |
| `src/assets/react.svg` | DELETE CANDIDATE | Template artifact; no source reference found. |
| `src/assets/vite.svg` | DELETE CANDIDATE | Template artifact; no source reference found. |

See `current-asset-inventory.md` for asset governance.

## Current user/data surfaces

Current browser code touches:

- Supabase Auth sign-up/sign-in/reset/password/session/user/sign-out flows;
- `profiles`;
- `user_settings`;
- `sessions`;
- `mechanic_progress`.

Current Worker exposes:

- `GET /api/latest`;
- `GET /api/beta-download`;
- static asset fallback for everything else.

Exact fields, auth sequence, Worker bindings, and R2 key behavior are documented in `current-data-contract.md`.

## Current route-like experiences

Current public behavior is primarily homepage anchors plus `/privacy` and `/terms`; authenticated dashboard navigation is local tab state rather than URLs. Exact current/target mapping is documented in `current-route-map.md`.

## Verified architectural assets to preserve

- React/Vite frontend foundation.
- Supabase browser auth/data direction.
- Cloudflare Worker trusted boundary.
- R2 private beta release storage.
- Worker bearer-token validation + server-side `beta_access` check before binary retrieval.
- immutable versioned release-key direction with a movable latest metadata pointer.

## Known migration risks

1. `App.jsx` combines public content, auth orchestration, preview data, navigation, and dashboard handoff.
2. `UserDashboard.jsx` is a large feature aggregate with inline CSS and local tab routing.
3. Worker refactoring can weaken protected download authorization if sequence/validation changes accidentally.
4. Package changes must update `package-lock.json` atomically.
5. Existing public anchor URLs may have external links and need compatibility handling.
6. `beta_access` is an adequate current flag but not a scalable entitlement system.
7. Consent/default semantics in `user_settings` must not change silently during data-layer refactoring.
8. Public product/status claims in roadmap/install content can become stale if not tied to verified release/product state.
9. Legal/privacy content currently lives in source code and must be intentionally versioned/reviewed as collection/retention/third-party practices evolve.
10. CI currently proves only lint/build, not auth/download behavior, direct routing, accessibility, or visual parity.

## W1 remaining external validation

Repository/source inventory is now sufficient to begin controlled W2 work. The following cannot be proven solely from repository source and remain explicit validation tasks:

- actual production Cloudflare secret configuration;
- authoritative Supabase schema/RLS policies;
- deployed production commit/domain configuration;
- current R2 release objects/metadata state;
- current code-signing/SmartScreen state of the delivered beta;
- current third-party processing configuration (for privacy disclosures).

No source cleanup should invent answers to those external facts.
