# ADR 0001: Web platform stack

- Status: Accepted
- Date: 2026-09-05

## Context

MechLab Web already runs on React/Vite, Supabase, Cloudflare Workers, and Cloudflare R2. The product is expanding from a marketing SPA into a long-lived public site plus authenticated player application with private release delivery and future account/product capabilities.

The decision must optimize for production maintainability, security boundaries, performance, developer ergonomics, and incremental migration without discarding working infrastructure.

## Decision

Retain the following platform choices:

- React for UI composition;
- Vite ecosystem for frontend development/build unless a later rendering ADR justifies a framework-level change;
- Cloudflare edge hosting and Workers for trusted web/API operations;
- Cloudflare R2 for large immutable/private artifacts;
- Supabase Auth + Postgres + RLS for identity and relational application data.

Migrate production application code to TypeScript and reorganize it into explicit public-site, authenticated-dashboard, Worker/API, shared-contract, data-access, and design-system boundaries.

## Why

The existing infrastructure already matches the product's requirements. Replacing it wholesale would add migration risk without fixing the current primary problems, which are weak module boundaries, a giant application orchestrator, plain JavaScript, shallow routing, ad-hoc data access, and insufficient automated quality gates.

## Alternatives considered

### Full Next.js migration

Provides integrated SSR/routing conventions but would replace more of the existing deployment/runtime model than is required. It remains a valid future option only if the chosen Cloudflare-compatible rendering strategy cannot meet requirements cleanly.

### Full static SPA

Simple, but insufficient as the long-term default for all public pages because important marketing/legal/product pages benefit from explicit URLs, metadata, and prerendered/server-rendered HTML.

### Custom backend replacing Supabase

Rejected. It would recreate identity, database, and authorization infrastructure without a demonstrated product requirement.

### Store releases in Supabase/Postgres

Rejected. Large immutable binaries belong in object storage; Postgres should hold metadata and authorization-relevant records.

## Consequences

- Existing working infrastructure is preserved.
- TypeScript and module restructuring become mandatory migration work.
- Rendering strategy for public routes is decided separately and must remain Cloudflare-compatible.
- Security-sensitive behavior stays out of browser-only code.
- Future departures from these platform choices require another ADR with evidence.
