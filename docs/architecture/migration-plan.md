# Web Architecture Migration Plan

## Principle

Migrate in controlled, reversible slices. Preserve production behavior first; improve structure second; remove obsolete code only after parity is demonstrated.

## Phase W0 — Preserve and baseline

Before structural migration:

- record the production commit and deployment configuration;
- preserve current Cloudflare Worker/R2 bindings and Supabase environment contract;
- capture canonical desktop/mobile screenshots;
- document existing public/authenticated user journeys;
- document current Worker endpoints and response contracts.

**Gate:** current production can be restored from source/configuration without reconstructing behavior from memory.

## Phase W1 — Inventory and classify

Inventory every route-like experience, component, Supabase query, Worker endpoint, environment variable, R2 key pattern, auth flow, workflow, and deployment artifact.

Classify each item as `KEEP`, `MOVE`, `REFACTOR`, `SUPERSEDE`, `ARCHIVE`, `DELETE`, or `NEEDS VALIDATION`.

**Gate:** no architectural deletion is based only on filename/age.

## Phase W2 — TypeScript foundation

Introduce strict TypeScript configuration and migrate low-risk boundaries first:

1. release constants/contracts;
2. Supabase helpers;
3. Worker services and handlers;
4. leaf components;
5. feature components;
6. application shell.

Temporary JavaScript interop is allowed during migration. New production modules are TypeScript.

**Gate:** build, lint, and behavior remain equivalent while typed coverage increases.

## Phase W3 — Real routing and public/app separation

Replace the giant single-page orchestration pattern with explicit routes. Separate public site concerns from authenticated application concerns.

Public routes include product, mechanics, AutoLearn, mobile, roadmap/changelog, download, pricing when applicable, privacy, and terms.

Authenticated routes include overview, progress, mechanics, sessions, replays, downloads, devices, and account.

**Gate:** every important URL supports direct navigation/refresh and has intentional auth behavior.

## Phase W4 — Design-system extraction

Extract canonical tokens and reusable primitives before broad visual redesign:

- color, typography, spacing, radius, elevation, motion, breakpoints;
- button, card, badge, form controls, modal/dialog, tabs, table/list, skeleton, empty/error states;
- MechLab domain components such as score displays, mechanic labels, session/replay rows.

**Gate:** existing design can be reproduced without route-specific style duplication.

## Phase W5 — Typed Supabase data layer

Generate database types and move browser data access behind typed repositories/services. Audit RLS for every user-owned table touched by the web product.

**Gate:** UI components do not contain arbitrary authorization-sensitive raw queries.

## Phase W6 — Worker modularization

Split the Worker into router, middleware, route handlers, and service integrations while retaining API compatibility.

Required cross-cutting behavior:

- authenticated user resolution;
- standardized errors;
- request IDs;
- security headers;
- method validation;
- rate-limit hooks;
- structured logs without credentials.

**Gate:** old frontend behavior remains compatible with the modular Worker.

## Phase W7 — Contracts and runtime validation

Create shared API/domain schemas. Compile-time types are insufficient at trust boundaries; validate untrusted request/response payloads at runtime.

**Gate:** malformed external/API payloads fail predictably with stable error codes.

## Phase W8 — Public rendering/SEO

Adopt prerendering or server rendering for public pages where it materially improves indexing, metadata, social previews, and first load. Keep authenticated dashboard routes client-heavy where appropriate.

**Gate:** canonical public content and metadata are available without depending on post-load SPA rendering.

## Phase W9 — Automated quality gates

Add or standardize:

- unit tests;
- Worker/integration tests;
- Playwright end-to-end tests;
- accessibility checks;
- approved visual-regression snapshots;
- build/type/lint gates.

Critical journeys include account creation/confirmation, sign-in, dashboard entry, authorized/unauthorized downloads, logout, expired sessions, and responsive navigation.

**Gate:** critical user journeys can be validated without manual clicking.

## Phase W10 — Security and operations hardening

Audit RLS, CORS, CSP/security headers, secrets, auth/session behavior, release immutability, rate limiting, request logging, error reporting, and rollback procedures.

**Gate:** a documented security checklist and rollback runbook pass in staging.

## Phase W11 — Staging and cutover

Exercise desktop/mobile browsers, signed-out/signed-in users, beta/no-beta entitlements, expired sessions, slow networks, and degraded Supabase/R2 conditions.

**Gate:** production deployment has a known rollback and the previous production revision remains deployable.

## Phase W12 — Remove compatibility architecture

Only after verified cutover, remove obsolete `App.jsx` orchestration, duplicate CSS, dead helpers, temporary compatibility routes, and superseded documentation.

**Gate:** no second implementation remains as an undocumented alternate source of truth.

## Definition of done

The migration is not complete until the web repo has strict typed production code, intentional routes, documented rendering strategy, generated DB types, audited RLS, modular Worker routes, shared contracts, design-system ownership, automated E2E/visual tests, preview/staging deployment, secure immutable downloads, observability, and canonical architecture/operations documentation.
