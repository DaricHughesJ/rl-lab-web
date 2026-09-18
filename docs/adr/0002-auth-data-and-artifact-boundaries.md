# ADR 0002: Authentication, relational data, and artifact boundaries

- Status: Accepted
- Date: 2026-09-05

## Context

The web product handles user authentication, beta access, synchronized product metadata, and private release binaries. These responsibilities have different trust, query, and storage characteristics.

## Decision

Use three explicit boundaries:

1. **Supabase Auth + Postgres + RLS** for identity, entitlements, user-scoped relational data, and metadata.
2. **Cloudflare Worker** for privileged web/API operations that cannot be trusted to browser code, including private artifact authorization and future webhook/server-only actions.
3. **Cloudflare R2** for large immutable artifacts such as Windows release binaries and future export/replay packages where object storage is appropriate.

Browser applications use only publishable Supabase credentials and the signed-in user's session. Service-role or equivalent privileged credentials never enter the browser bundle.

## Authorization model

UI visibility is not an authorization boundary.

- User-owned relational rows are protected by RLS.
- Privileged Worker routes resolve and validate identity before performing protected operations.
- Artifact access is authorized before R2 retrieval or signed delivery.
- Entitlements must evolve beyond one-off UI metadata fields when the product gains multiple plans/roles.

## Artifact model

Release and large artifact objects are immutable and version-addressed. A mutable `latest` record/manifest may point to an immutable object, but the versioned object itself is never overwritten.

Postgres stores metadata such as owner, version, checksum, size, state, timestamps, and object key. It does not store large binary payloads.

## Consequences

- Supabase remains the canonical identity/relational system.
- R2 remains the canonical large-object system for web-served artifacts.
- Worker code is security-sensitive and requires dedicated integration tests.
- RLS policies become documented/tested product infrastructure.
- Future subscription/founder/beta access should use explicit entitlement records rather than accumulating unrelated booleans on profile rows.
