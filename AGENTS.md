# MechLab Web Engineering Instructions

This repository is a production component of the MechLab product. Treat changes as commercial software work, not disposable prototype work.

## Sources of truth

Read these before architecture or platform changes:

1. `ARCHITECTURE.md`
2. `docs/architecture/README.md`
3. `docs/architecture/target-architecture.md`
4. relevant ADRs under `docs/adr/`
5. current GitHub issue/PR for implementation status

Do not create competing roadmap, TODO, architecture, or release-plan documents elsewhere.

## Engineering standard

For a material design or implementation choice, use the strongest practical approach supported by current requirements and evidence. Do not preserve an old choice merely because code already exists, and do not rewrite working code merely because a newer tool exists.

Before a major technology or boundary change:

- state the requirement;
- identify realistic alternatives;
- compare reliability, security, performance, maintainability, integration cost, testability, deployment/rollback, and product quality;
- record durable decisions in an ADR;
- define migration and rollback gates.

If implementation repeatedly fights a framework, duplicates domain concepts, crosses trust boundaries awkwardly, or creates recurring release/packaging failures, trigger an architecture review rather than stacking another workaround.

## Non-negotiable boundaries

- Browser-visible code never contains privileged secrets.
- Hidden/disabled UI is not authorization; enforce authorization with RLS and/or trusted Worker code.
- Supabase access belongs behind typed data services/repositories as migration progresses.
- Worker/API/R2 payloads are untrusted boundaries and require runtime validation in the target architecture.
- Versioned release artifacts are immutable.
- Production behavior is not deleted until replacement parity and rollback are proven.
- Large binary artifacts do not belong in Postgres or Git history unless deliberately approved as small test fixtures.
- Runtime/generated files do not belong in source control.

## Quality requirements

New production work must move toward:

- strict TypeScript;
- explicit routes and ownership;
- reusable design-system primitives;
- unit/integration/E2E/accessibility/visual-regression coverage appropriate to the change;
- explicit loading, empty, error, degraded, and unauthorized states;
- structured errors/logging without credentials;
- responsive behavior and WCAG 2.2 AA baseline;
- performance budgets for public pages.

Never claim a visual implementation matches a reference without rendered comparison evidence.

## TODOs and status

Implementation status belongs in GitHub Issues/PRs. Code TODO/FIXME comments must either be resolved in the same work or reference a tracked issue with enough context to be actionable.

## Destructive changes

Before deleting or superseding a file/system, verify imports/references, runtime behavior, tests, CI/deployment usage, external URLs/contracts, and whether it is the only copy of historical evidence that should be archived.
