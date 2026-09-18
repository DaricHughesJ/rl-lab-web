# Web Quality Gates

These gates define the minimum evidence required before architecture migration changes can be considered production-ready.

## Required on every production-bound change

- dependency install from lockfile succeeds;
- lint passes;
- TypeScript typecheck passes once W2 enables strict TS tooling;
- unit tests pass;
- production build succeeds;
- Worker integration tests pass for changed trusted routes;
- no browser bundle contains privileged secrets;
- accessibility smoke checks pass for changed user flows;
- approved visual-regression tests pass for changed canonical screens.

## Required for auth/data changes

- signed-out access rejected where required;
- signed-in user can access only authorized rows/actions;
- expired/invalid session behavior is defined and tested;
- RLS change reviewed together with application assumptions;
- server-only credentials stay server-only.

## Required for release/download changes

- unauthorized download returns denial without object disclosure;
- authorized download returns expected immutable artifact;
- checksum/version/size metadata agrees with published release manifest;
- missing metadata/object has a defined failure response;
- object key validation prevents arbitrary bucket access.

## Required for public-page changes

- direct URL load works;
- canonical metadata is correct;
- mobile/desktop responsive checks pass;
- performance budget is not materially regressed without an accepted reason;
- content remains usable under reduced motion and keyboard navigation.

## Required before architecture cutover

- staging matrix completed;
- rollback procedure executed successfully in a non-production environment;
- legacy implementation retained until parity evidence is accepted;
- production monitoring/logging can identify deployment version and request failures.

A green build alone is not proof of user-facing correctness. Visual, authorization, packaged/deployed behavior, and rollback evidence are first-class release gates.
