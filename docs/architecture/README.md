# MechLab Web Architecture

This directory is the canonical architecture source of truth for the MechLab website and authenticated web application.

## Current production direction

MechLab Web is being standardized around these boundaries:

- **Public website:** React + TypeScript with prerendered/server-rendered public routes where appropriate.
- **Authenticated dashboard:** React + TypeScript, route-based and feature-oriented.
- **Trusted edge API:** Cloudflare Worker routes for privileged operations, authorization checks, downloads, webhooks, and storage access.
- **Identity and relational data:** Supabase Auth + Postgres + Row Level Security.
- **Large immutable artifacts:** Cloudflare R2.
- **Contracts:** Shared TypeScript runtime-validated request/response schemas.
- **Testing:** unit, integration, end-to-end, accessibility, and visual-regression gates.

## Architectural rules

1. Browser code never receives service-role or other privileged secrets.
2. Hiding UI is never authorization. Authorization is enforced by RLS and/or trusted Worker code.
3. Components do not issue arbitrary database queries. Data access goes through typed repositories/services.
4. Public pages must have stable URLs, metadata, and a rendering strategy suitable for search engines and social previews.
5. Large files do not live in Postgres. Postgres stores metadata; object storage stores immutable artifacts.
6. API contracts are typed and runtime validated at trust boundaries.
7. Every major architectural deviation requires an ADR.
8. Working production behavior is preserved during migration; cleanup follows verified cutover.

## Canonical documents

- `target-architecture.md` — target platform layout and responsibility boundaries.
- `migration-plan.md` — phased migration with acceptance gates and rollback requirements.
- `../adr/` — architecture decisions and rationale.

Historical plans must not compete with these documents as a source of truth.
