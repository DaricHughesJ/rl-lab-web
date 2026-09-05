# Environment Contract

Status: initial baseline; values/secrets are intentionally not duplicated here.

## Rules

Environment variables are classified by trust level. Documentation records names and purpose, never secret values.

### Browser-safe

Values compiled into or directly available to the browser must be safe to disclose publicly. Typical examples include the Supabase project URL and publishable browser key.

### Worker/server-only

Privileged credentials and service secrets exist only in Cloudflare Worker/server environments. They must never use Vite public-variable prefixes, appear in frontend source, be committed, be emitted to client logs, or be returned by APIs.

## Current known bindings

| Name/binding | Runtime | Classification | Purpose |
| --- | --- | --- | --- |
| `SUPABASE_URL` | Worker | Public identifier/config | Supabase project API base URL. |
| `SUPABASE_KEY_SECRET` | Worker secret | SECRET | Worker credential used when validating/querying protected Supabase resources. Never expose to browser. |
| `BETA_DOWNLOADS` | Worker R2 binding | Server-only binding | Private beta release objects and release metadata. |
| Supabase browser URL/key from `.env.example` | Browser build | Browser-safe only if publishable key | Browser auth/data client. Must never be service-role credentials. |

## Enforcement requirements

- CI should detect obvious secret files/credential patterns where practical.
- `.env.local` and equivalent local secret files remain ignored.
- Production secrets are managed through platform secret storage, not repository files.
- Worker logs must never include bearer tokens, API keys, refresh tokens, or signed credentials.
- Every new environment variable must be added to this contract with runtime and trust classification.

## Pending audit

W0-W1 inventory must enumerate `.env.example`, deployment workflows, and Cloudflare configuration to confirm all names and remove ambiguity between browser-safe and privileged credentials.
