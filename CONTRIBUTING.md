# Contributing to MechLab Web

## Change workflow

1. Start from an issue or a clearly scoped bug/fix.
2. Read `AGENTS.md` and the relevant architecture/ADR documents.
3. Work on a focused branch.
4. Preserve behavior before structural refactors with tests or explicit parity evidence.
5. Keep commits reviewable and avoid mixing unrelated cleanup with behavior changes.
6. Open a pull request describing behavior, risk, validation, and rollback implications.

## Architecture

Changes to framework choice, rendering strategy, trust boundaries, storage ownership, auth/authorization, deployment topology, or externally durable contracts require an ADR or an explicit update to an existing ADR.

## Code quality

During the migration, existing JavaScript may remain temporarily, but new production modules should be TypeScript unless a documented migration constraint prevents it.

Do not:

- add arbitrary raw Supabase queries directly to new UI components;
- expose privileged secrets to browser bundles;
- add new global CSS when an owned component/token is appropriate;
- use UI state as security enforcement;
- add ad-hoc TODO/roadmap markdown files;
- commit generated output, local secrets, downloaded builds, or runtime account/training data.

## Testing expectation

Validation should match risk:

- pure logic: unit tests;
- data/Worker boundaries: integration tests;
- user journeys/auth/downloads: browser E2E;
- approved visual surfaces: visual regression;
- interactive controls: accessibility/keyboard checks;
- production delivery changes: staging/rollback verification.

Until the full target test stack lands, a PR must explicitly state which validations are unavailable rather than implying coverage exists.

## Pull request description

Every material PR should answer:

- What changed?
- Why is this the correct boundary/implementation?
- What user behavior changes, if any?
- What was tested?
- What is the failure/rollback path?
- Does this alter auth, RLS, Worker trust, R2 artifacts, public URLs, or privacy/consent semantics?
