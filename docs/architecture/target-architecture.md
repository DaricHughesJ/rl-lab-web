# Target Architecture

## Scope

This document defines the production architecture for `rl-lab-web`. It covers the public marketing site, authenticated player dashboard, trusted edge/API operations, authentication, relational data, and large artifact delivery.

## System boundary

```text
                         mechlab.gg
                             |
                    Cloudflare edge
                             |
          +------------------+------------------+
          |                  |                  |
          v                  v                  v
   Public website      Player web app      Trusted API
   prerender/SSR       authenticated       Worker routes
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

## Responsibilities

### Public website

Owns public product information, mechanics pages, product education, roadmap/changelog, mobile information, pricing, download entry points, and legal pages.

Requirements:

- stable route per meaningful page;
- search/social metadata;
- prerendered or server-rendered HTML where appropriate;
- minimal client JavaScript for content-only pages;
- shared design system;
- accessibility and performance budgets.

### Authenticated player web app

Owns account-facing and synchronized product experiences such as overview, progress, mechanics, sessions, replay metadata, downloads, devices, and account settings.

Requirements:

- authenticated route boundary;
- typed domain data;
- feature-oriented modules;
- loading, empty, stale, degraded, and error states;
- no direct privileged operations from browser code.

### Cloudflare Worker

Owns trusted edge operations, including private beta/release downloads and future privileged endpoints.

The Worker is the server-side trust boundary for operations that cannot be safely performed by browser code. Route handlers must be separated from middleware and service integrations.

### Supabase

Owns identity, relational metadata, user-scoped application data, authorization through RLS, and server-queryable product metadata.

Browser access is limited to publishable credentials plus the signed-in user's session. Privileged keys are server-side only.

### Cloudflare R2

Owns immutable or large object payloads such as release binaries and future downloadable/exported artifacts. Database rows store metadata and authorization-relevant references, not large binary payloads.

## Frontend organization

Target repository shape:

```text
apps/
  site/          public routes and marketing experience
  dashboard/     authenticated product experience
  worker/        trusted Cloudflare Worker
packages/
  ui/            design tokens and reusable components
  contracts/     API/domain schemas and shared types
  supabase/      generated DB types and typed repositories
  config/        shared build/lint/test configuration
tests/
  unit/
  integration/
  e2e/
  visual/
docs/
  architecture/
  adr/
  operations/
```

The migration may temporarily keep the current root application while functionality is moved incrementally. Temporary compatibility layout is not the final architecture.

## Data access rules

- UI components consume feature hooks/services, not scattered raw SQL/PostgREST calls.
- Supabase database types are generated from the schema.
- RLS is the primary user-row authorization boundary.
- Worker authorization is required for R2/private operations and other privileged server behavior.
- Runtime validation is required for untrusted API payloads and external data.

## Release architecture

```text
source commit
    |
CI quality gates
    |
Windows artifact produced elsewhere
    |
signing / checksum / manifest
    |
immutable R2 release path
    |
Worker authorization
    |
authorized user download
```

Release objects are immutable and versioned. `latest` is metadata pointing to a versioned artifact, never a mutable binary object masquerading as a release history.

## Non-goals

- Replacing React merely for novelty.
- Moving large artifacts into Postgres.
- Reimplementing Supabase authentication inside the Worker.
- Combining website, desktop engine, and native overlay into one runtime.
- Performing a visual redesign at the same time as every architectural migration step.
