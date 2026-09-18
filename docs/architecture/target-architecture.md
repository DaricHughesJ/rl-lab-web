# Target Architecture

## Scope

This document defines the production architecture for `rl-lab-web`: public MechLab pages, authenticated player web application, trusted edge/API operations, authentication, relational data, and large artifact delivery.

The durable rendering/routing decision is ADR 0003: React Router v8 Framework Mode on Cloudflare Workers.

## System boundary

```text
                         mechlab.gg
                             |
                    Cloudflare edge
                             |
                      React Router v8
                   Cloudflare Worker runtime
                             |
          +------------------+------------------+
          |                  |                  |
          v                  v                  v
   Public SSR routes    /app/* web UI       Trusted API
   cache where safe     authenticated       server routes
          |                  |                  |
          +-----------+------+                  |
                      |                         |
                      v                         |
                   Supabase <------------------+
              Auth / Postgres / RLS
                      |
                      +------------------+
                                         |
                                         v
                                  Cloudflare R2
                              releases / artifacts
```

This is intentionally one coherent web application/runtime, not separate marketing and dashboard microfrontends. Separation is by routes/features/trust boundaries, not by multiplying deployments without a demonstrated need.

## Public website

Owns product information, mechanics, coaching/AutoLearn education, roadmap/changelog, mobile information, download entry points, and legal pages.

Requirements:

- stable URL for each meaningful page;
- server-rendered initial HTML using React Router v8 on Cloudflare Workers;
- deliberate edge/CDN caching for public responses where semantics permit;
- canonical title/description/OpenGraph/structured metadata;
- route-level code splitting;
- minimal hydration/client behavior on content-only routes where practical;
- shared design tokens/components;
- WCAG 2.2 AA baseline and explicit performance budgets.

Static prerendering is not a current architecture requirement. ADR 0003 documents why edge SSR is preferred over adopting a second framework solely for prerender support.

## Authenticated player web app

Lives under `/app/*` and owns account-facing/synchronized experiences such as overview, progress, mechanics, sessions, replay metadata, downloads, devices, and account settings.

Requirements:

- intentional auth route boundary and return-to-destination behavior;
- typed domain data and feature-owned modules;
- loading, empty, stale, degraded, unauthorized, and error states;
- interaction-heavy behavior remains client-side where server rendering adds no value;
- browser code never performs privileged operations merely because UI hides controls.

## Trusted server/Worker boundary

The React Router Cloudflare Worker entry is the server-side trust boundary. It owns or delegates privileged web operations including private release downloads and future server-only endpoints.

Server responsibilities include:

- authenticated user resolution where Worker authorization is required;
- protected R2 access;
- server-only credentials/bindings;
- method/content validation;
- stable API errors and request IDs;
- security headers and rate-limit hooks;
- structured logs without credentials;
- React Router SSR request handling.

The existing beta-download authorization sequence is preserved until compatibility tests prove its replacement.

## Supabase

Supabase owns identity, Postgres relational/user metadata, browser-accessible user-scoped data, and RLS authorization.

Rules:

- browser uses only publishable credentials plus user session;
- service/privileged credentials remain server-only;
- generated database types reflect the authoritative schema;
- user-owned tables require explicit RLS validation;
- entitlements such as beta/founder/admin cannot be self-granted by browser clients.

## Cloudflare R2

R2 owns large or immutable object payloads such as release binaries and future exported/evidence artifacts where cloud object storage is appropriate.

Postgres stores metadata/authorization references, not large binary payloads. Versioned released binaries are immutable; `latest` is a pointer/manifest, not a mutable historical artifact.

## Target repository shape

Do not introduce a workspace/microfrontend split unless scale or sharing requirements prove it is needed. The target for the current product is a single React Router full-stack application with strong internal ownership:

```text
app/
  root.tsx
  routes.ts
  routes/
    _public.*
    app.*
    auth.*
  features/
    auth/
    account/
    dashboard/
    mechanics/
    sessions/
    releases/
    roadmap/
  components/
    ui/
    domain/
  styles/
    tokens.css
    globals.css
  services/
    browser/
    server/
  contracts/
  types/
workers/
  app.ts
  middleware/
  services/
public/
tests/
  unit/
  integration/
  e2e/
  visual/
docs/
  architecture/
  adr/
  operations/
react-router.config.ts
vite.config.ts
wrangler.jsonc
```

The exact route filenames should follow React Router framework conventions when migration tooling is installed. The important boundary is ownership, not decorative folder depth.

## Feature ownership rules

- Route modules coordinate route data/navigation; they do not become new monoliths.
- Reusable generic UI belongs under `app/components/ui`.
- MechLab-specific reusable UI belongs under `app/components/domain` or its owning feature.
- Feature-only components/services stay inside the feature.
- Browser Supabase access goes through typed browser repositories/services.
- Server-only code lives in clearly server-owned modules and must not be imported into browser bundles.
- API/domain contracts are shared only where both sides actually need them.
- Avoid a `utils` dumping ground; utilities require a clear domain or platform owner.

## Data access

- UI components do not scatter raw PostgREST queries.
- Supabase database types are generated from the schema.
- RLS is the user-row authorization boundary for browser-readable tables.
- Worker/server authorization protects R2 and privileged operations.
- Runtime validation is required at untrusted HTTP/object-storage/webhook boundaries.
- Consent and privacy defaults are explicit product contracts, not incidental component defaults.

## Release architecture

```text
source commit
    |
CI quality gates
    |
Windows artifact produced by authoritative release pipeline
    |
signing + checksum + manifest
    |
immutable versioned R2 object
    |
trusted Worker authorization
    |
authorized user download
```

Website release metadata must identify the actual desktop artifact/version rather than duplicate release truth manually where automation can supply it.

## Deployment environments

At minimum, environment ownership must distinguish:

- local development;
- PR/preview;
- staging;
- production.

Production credentials/data are not the default development target. Rollback is a documented, tested operation.

## Non-goals

- Replacing React for novelty.
- Adding TanStack Start solely to gain static prerendering.
- Maintaining separate public/dashboard microfrontends without measured need.
- Building custom SSR infrastructure when the supported React Router/Cloudflare integration satisfies requirements.
- Moving large artifacts into Postgres.
- Reimplementing Supabase authentication from scratch in Worker code.
- Combining website, desktop engine, and native overlay into one runtime.
- Performing a broad visual redesign simultaneously with every structural migration step.
