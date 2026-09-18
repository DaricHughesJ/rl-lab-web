# Current Data and Trust Contract

Status: W1 inventory. This describes what the current web source actually reads/writes before the data layer is reorganized.

## Browser Supabase client

`src/lib/supabase.js` creates the browser client from:

- `VITE_SUPABASE_URL`;
- `VITE_SUPABASE_PUBLISHABLE_KEY`.

The browser client persists sessions, refreshes tokens automatically, and detects auth sessions in the URL.

These values are browser-visible by design. Privileged/service-role credentials must never be placed in a `VITE_*` variable.

## Current auth operations

| Operation | Supabase API | Notes |
| --- | --- | --- |
| beta sign-up | `auth.signUp` | Writes onboarding values to user metadata: display name, Rocket League rank, platform, beta request state. |
| sign-in | `auth.signInWithPassword` | Browser session. |
| password reset request | `auth.resetPasswordForEmail` | Redirect currently returns to the site with `?recovery=1`. |
| password change | `auth.updateUser` | Authenticated user operation. |
| sign-out | `auth.signOut` | Used by dashboard. |
| session bootstrap | `auth.getSession` | Used by `App.jsx`. |
| auth change subscription | `auth.onAuthStateChange` | Used by `App.jsx`. |
| current user lookup | `auth.getUser` | Used before profile/settings writes. |

## Current relational tables used by browser code

### `profiles`

Current selected fields:

- `display_name`;
- `rank_bucket`;
- `beta_access`.

Current write fields:

- `user_id`;
- `display_name`;
- `rank_bucket`;
- `updated_at`.

`beta_access` is read as the current beta entitlement. It is not written by the browser helper and must remain server/admin governed.

### `user_settings`

Current selected/written settings:

- `cloud_progress_sync`;
- `usage_analytics`;
- `contribute_training_data`.

Writes also include `user_id` and `updated_at`.

Default client behavior when no row exists:

- cloud progress sync: `true`;
- usage analytics: `false`;
- training-data contribution: `false`.

The privacy and consent semantics of these defaults must stay explicit when repositories are introduced.

### `sessions`

Current selected fields:

- `id`;
- `recorded_at`;
- `duration_seconds`;
- `total_attempts`;
- `summary`.

The dashboard currently fetches the most recent 50 ordered by `recorded_at` descending.

### `mechanic_progress`

Current selected fields:

- `id`;
- `session_id`;
- `mechanic`;
- `attempts`;
- `mean_score`;
- `consistency`;
- `best_score`;
- `trend`;
- `metrics`;
- `created_at`.

The dashboard currently fetches the most recent 250 ordered by `created_at` descending and derives latest-per-mechanic data in browser memory.

## Worker trust boundary

`src/worker.js` currently owns two `/api/*` endpoints and otherwise delegates to the static asset binding.

### `GET /api/latest`

Reads release metadata from the `BETA_DOWNLOADS` R2 binding using the current metadata key and returns release/version/download information. The response is public and cacheable for a short period.

Current response fields:

- version;
- tag;
- sha256;
- size;
- commit;
- build run ID;
- published timestamp;
- site URL;
- release notes.

A typed compile-time representation already exists at `src/contracts/release.ts`; runtime validation has not landed yet.

### `GET /api/beta-download`

Current authorization flow:

1. require `Authorization: Bearer <token>`;
2. validate the token through Supabase Auth `/auth/v1/user`;
3. query `profiles.beta_access` for that user;
4. reject users without beta access;
5. load current release metadata from R2;
6. validate the metadata `object_key` against the accepted release-key pattern;
7. retrieve the private executable from `BETA_DOWNLOADS`;
8. stream it with private/no-store and `nosniff` headers plus release metadata headers when available.

This sequence is security-sensitive and must receive compatibility tests before modularization.

## Worker bindings/configuration

From `wrangler.jsonc`:

- `SUPABASE_URL` — Worker configuration value;
- `SUPABASE_KEY_SECRET` — referenced by Worker code and therefore required as a Cloudflare secret even though it is not written in `wrangler.jsonc`;
- `BETA_DOWNLOADS` — R2 binding to the private beta bucket;
- `ASSETS` — Cloudflare static asset binding;
- `/api/*` is routed through Worker code before asset handling.

## R2 key contract

Current code contains three related concepts:

- a fallback executable key such as `releases/v0.2.0-beta.1/MechLab.exe`;
- current release metadata at `releases/current/latest.json`;
- metadata may nominate an executable object key, but Worker validation only accepts versioned `releases/v<semver>-beta.<n>/MechLab.exe`-style paths.

The migration must preserve immutable versioned release objects. `latest.json` may move as a pointer, but released binaries must not be overwritten in place.

## Required RLS audit

The repository currently assumes RLS protects browser access but does not contain the authoritative Supabase policies. Before W5 is complete, verify and document policies for at least:

- `profiles`;
- `user_settings`;
- `sessions`;
- `mechanic_progress`;
- any future replay/device/entitlement tables exposed to web clients.

The audit must prove that one authenticated user cannot read or mutate another user's rows, and that browser code cannot grant itself privileged entitlements such as beta/founder/admin access.

## Migration rules

1. Generate database types from the authoritative Supabase schema; do not hand-invent row shapes as the long-term source of truth.
2. Separate browser client creation, auth services, and domain repositories.
3. UI components consume repository/service APIs, not raw table queries.
4. Runtime-validate Worker trust-boundary payloads and R2 metadata.
5. Stable API errors use machine-readable codes and request IDs.
6. Do not change consent defaults silently during refactoring.
7. Do not move privileged Worker behavior into the browser for convenience.
