# MechLab Web

Production web platform for MechLab: public product site, beta onboarding, Supabase authentication, authenticated player dashboard, and protected release delivery.

## Architecture

Canonical architecture documentation:

- [`ARCHITECTURE.md`](ARCHITECTURE.md)
- [`docs/architecture/target-architecture.md`](docs/architecture/target-architecture.md)
- [`docs/architecture/migration-plan.md`](docs/architecture/migration-plan.md)
- [`docs/adr/`](docs/adr/)

The current implementation is being migrated incrementally. Working React/Vite, Cloudflare Worker/R2, and Supabase behavior is preserved while responsibilities are separated and production code moves to TypeScript.

## Current stack

- React + Vite
- Supabase Auth/Postgres/RLS
- Cloudflare Workers
- Cloudflare R2 private release storage
- Oxlint

## Local development

1. Copy `.env.example` to `.env.local`.
2. Provide only browser-safe Supabase configuration in frontend environment variables.
3. Install dependencies using the repository lockfile.
4. Run the development server.

```bash
npm ci
npm run dev
```

Build and lint:

```bash
npm run build
npm run lint
```

## Security rules

- Never expose Supabase service-role or other privileged keys to browser code.
- UI visibility is not authorization. Protected data/actions require RLS and/or trusted Worker enforcement.
- Private release artifacts are retrieved through authorized Worker flows; do not make the R2 beta bucket public.
- Do not commit `.env.local`, credentials, tokens, downloaded builds, or runtime data.

See [`docs/operations/environment-contract.md`](docs/operations/environment-contract.md).

## Repository/project management rules

- Durable architecture decisions belong in `docs/adr/`.
- Current architecture belongs in `docs/architecture/`.
- Operational procedures belong in `docs/operations/`.
- Implementation work/TODO status belongs in GitHub issues and pull requests, not new ad-hoc roadmap files.
- Do not delete or rewrite production behavior during migration without parity evidence and a rollback path.

The umbrella migration program is tracked in GitHub issue #6.
