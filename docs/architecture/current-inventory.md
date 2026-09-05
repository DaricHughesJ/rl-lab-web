# Current Repository Inventory

Status: in progress

This document records the pre-migration web implementation so cleanup does not depend on memory. Items are classified conservatively; `DELETE` is used only after dependency/behavior validation.

## Root

| Path | Current role | Classification | Notes |
| --- | --- | --- | --- |
| `.env.example` | Browser/server environment example | KEEP / REFACTOR | Split public vs secret variables clearly. |
| `.github/` | CI/deployment automation | KEEP / AUDIT | Must be aligned with type/test/preview/staging gates. |
| `.gitignore` | Generated/local exclusions | KEEP / AUDIT | Verify Cloudflare/Vite/test outputs. |
| `.oxlintrc.json` | Lint configuration | KEEP / REFACTOR | Extend for TypeScript architecture. |
| `README.md` | Development/setup documentation | REWRITE | Currently still describes a minimal Vite template and must point to canonical architecture/operations docs. |
| `index.html` | Vite HTML shell | KEEP DURING MIGRATION | Rendering strategy may change for public routes. |
| `package.json` | JS package/scripts | KEEP / REFACTOR | React/Vite/Supabase/Cloudflare retained; add typed/test tooling deliberately. |
| `package-lock.json` | npm lockfile | KEEP UNTIL PACKAGE-MANAGER DECISION | Do not hand-edit; update atomically with dependency changes. |
| `public/` | Public static assets | KEEP / AUDIT | Classify product assets and generated/static metadata. |
| `src/` | Current site/dashboard/Worker source | REFACTOR | Current concerns are mixed and will be separated incrementally. |
| `vite.config.js` | Vite build config | KEEP / REFACTOR | Migrate to TypeScript when tooling lands. |
| `wrangler.jsonc` | Cloudflare Worker/R2/static binding config | KEEP | Production-critical; changes require deployment validation. |

## Current frontend source

| Path | Current role | Classification | Notes |
| --- | --- | --- | --- |
| `src/App.jsx` | Main marketing/auth/dashboard orchestration | REFACTOR / SPLIT | Too many product concerns in one module. Preserve behavior while extracting routes/features. |
| `src/App.css` | Main site/application styling | REFACTOR / SPLIT | Large global stylesheet; extract tokens/components without redesigning blindly. |
| `src/index.css` | Global baseline styles | KEEP / REFACTOR | Should become deliberate global/reset/token entry point. |
| `src/main.jsx` | React bootstrap | KEEP / MIGRATE TS | Small stable entry point. |
| `src/assets/` | Source-controlled visual assets | KEEP / AUDIT | Verify licensing, ownership, duplication, resolution, and usage. |
| `src/components/AuthModal.jsx` | Authentication UI | KEEP / MIGRATE | Move to auth feature boundary and TypeScript. |
| `src/components/DevelopmentRoadmap.jsx` | Public roadmap UI | KEEP / MOVE | Should become route/feature-owned rather than generic component root. |
| `src/components/DevelopmentRoadmap.css` | Roadmap styling | REFACTOR | Fold into design-system/feature styling strategy. |
| `src/components/InstallWizard.jsx` | Download/install UX | KEEP / MOVE | Separate presentation from release/download authorization. |
| `src/components/LegalDocs.jsx` | Legal content presentation | MOVE / REVIEW | Legal pages require stable routes and canonical content ownership. |
| `src/components/UserDashboard.jsx` | Authenticated player dashboard | REFACTOR / SPLIT | Large feature surface; migrate into explicit `/app` routes/features. |
| `src/lib/release.js` | Release constants/contracts | KEEP / MIGRATE FIRST | Good low-risk TypeScript boundary candidate. |
| `src/lib/supabase.js` | Browser Supabase integration/data helpers | KEEP / SPLIT | Separate client creation from typed repositories/services. |
| `src/worker.js` | Cloudflare trusted API + static fallback | KEEP / MODULARIZE | Security-critical. Preserve current download behavior while splitting router/middleware/services. |

## Current platform decisions verified from source

- React + Vite currently build the web frontend.
- Supabase browser client provides authentication/data access.
- Cloudflare Worker owns `/api/*` handling and otherwise delegates to static assets.
- R2 binding `BETA_DOWNLOADS` stores private beta release objects.
- The Worker validates a bearer session through Supabase, checks `profiles.beta_access`, then retrieves the authorized binary from R2.
- R2 release metadata is read separately from the binary object.

These are preserved architectural assets, not targets for gratuitous replacement.

## Known migration risks

1. `App.jsx` combines public content, auth orchestration, product previews, and dashboard handoff; splitting it can easily create navigation/auth regressions.
2. `UserDashboard.jsx` is already a large feature aggregate and should not simply become another monolithic route.
3. Worker refactoring is security-sensitive because private downloads depend on exact auth and object-selection behavior.
4. Package/tooling migration must update the lockfile atomically; architecture work must not leave dependency manifests inconsistent.
5. Public marketing sections currently behave like one SPA surface; introducing routes/rendering must preserve anchors/links or intentionally redirect them.
6. `beta_access` is sufficient for the current private beta but is not a scalable long-term entitlement model.

## Next inventory work

- enumerate `.github` workflows and deployment assumptions;
- enumerate `public/` and `src/assets/` files and classify assets;
- map every Supabase query/table/field used by browser and Worker code;
- map every public navigation target and authenticated view;
- capture environment-variable trust classification;
- capture current release key/manifest format;
- identify dead/unreferenced source only after code-reference audit.
