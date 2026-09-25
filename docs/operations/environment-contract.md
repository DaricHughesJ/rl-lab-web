# Environment Contract

Status: W1 baseline verified from `.env.example`, `.env.production`, `wrangler.jsonc`, and current Worker/browser source. Secret values are intentionally not duplicated here. Browser-safe Supabase public configuration is committed in `.env.production` so production builds do not depend on an external build-environment setting being present.

## Rule

Every environment value/binding has an owning runtime and trust classification. Documentation records names and purpose, never secret values.

## Browser build

| Name | Classification | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | PUBLIC CONFIG | Supabase project URL consumed by the browser client. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | PUBLIC/PUBLISHABLE CREDENTIAL | Supabase browser key. It is not a service-role secret and is expected to be visible in the built frontend. |

`.env.example` documents the browser variable contract. `.env.production` contains only the production project's browser-safe URL and publishable key so Vite production builds always initialize Supabase. A privileged key must never be introduced with a `VITE_*` prefix.

## Cloudflare Worker

| Name/binding | Classification | Purpose/source |
| --- | --- | --- |
| `SUPABASE_URL` | PUBLIC CONFIG | Worker Supabase base URL. Currently configured in `wrangler.jsonc`. |
| `SUPABASE_KEY_SECRET` | SECRET | Worker credential used for Supabase Auth/REST requests. Referenced by source; must be provided through Cloudflare secret storage, not committed configuration. |
| `BETA_DOWNLOADS` | SERVER-ONLY R2 BINDING | Private beta release objects and release metadata. Configured in `wrangler.jsonc`. |
| `ASSETS` | SERVER RUNTIME BINDING | Static asset binding generated/configured by Wrangler. Worker delegates non-API requests to it. |

Current Wrangler routing runs Worker code first for `/api/*` and otherwise allows static asset handling with SPA fallback.

## Local files

- `.env.example` is committed and contains names/placeholders only.
- `.env.production` is committed and contains only browser-safe Supabase public configuration.
- Other `.env`, `.env.*`, and `*.local` files remain ignored.
- Developers must not place service-role, Worker, signing, webhook, or other privileged secrets in frontend environment variables.

## Target environment separation

The production architecture requires explicit environment ownership for:

- local development;
- pull-request/preview deployments;
- staging;
- production.

Each environment must define its Cloudflare/Supabase/R2 targets intentionally. Production data and privileged production credentials must not be the default development target.

## Enforcement requirements

- CI should detect obvious committed secret/credential patterns where practical.
- Production secrets use platform secret storage.
- Worker logs never include bearer tokens, refresh tokens, API keys, passwords, or signed credentials.
- New environment variables require an update to this contract in the same change.
- Secret rotation must not require source-code edits.
- Preview/staging deployments must make the selected environment obvious enough to prevent accidental production mutation.

## Remaining W1 validation

The repository does not encode the actual Cloudflare secret value or the authoritative Supabase RLS configuration, as expected. W5/W10 must verify deployed environment configuration and RLS through the relevant platform configuration rather than guessing from application source.
