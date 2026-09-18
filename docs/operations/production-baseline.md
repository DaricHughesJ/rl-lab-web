# Pre-Migration Web Baseline

Status: source baseline preserved; deployed Cloudflare state still requires platform verification.

## Source baseline

The architecture migration branch was created from:

- repository: `DaricHughesJ/rl-lab-web`;
- branch: `main`;
- commit: `728e44b3b8a2b7a113b71cc6cd365c30a3ec61dc`;
- commit message: `Keep a safe beta fallback until first promoted build`;
- preserved branch: `archive/pre-web-standardization-2026-09-05`.

This commit is the source-level rollback baseline for the standardization program. Do not move the canonical archive branch forward.

## Source behavior at baseline

At the preserved commit:

- React/Vite provides the public site and authenticated dashboard;
- `/privacy` and `/terms` are manually dispatched in the React bootstrap;
- most public navigation is homepage anchors;
- authenticated dashboard navigation is local tab state;
- Supabase supplies browser auth and user-scoped data;
- Cloudflare Worker owns `/api/latest` and `/api/beta-download`;
- protected download requires a bearer session and server-side `profiles.beta_access` check;
- `BETA_DOWNLOADS` R2 binding supplies release metadata and executable objects;
- fallback desktop release is `0.2.0b1` at the versioned R2 object key encoded in source.

## What this baseline does NOT prove

Repository state alone does not prove:

- which commit is currently deployed to `mechlab.gg` at any later instant;
- Cloudflare secret values/configuration;
- current R2 object contents;
- current Supabase RLS policy definitions;
- DNS/custom-domain configuration;
- code-signing/SmartScreen state of the downloadable executable.

Those are deployment/platform facts and must be verified against the owning systems before a production cutover claim.

## Rollback principle

Until W11 cutover succeeds, the preserved source baseline remains buildable/deployable independently of the migration branch. Migration work must not require rewriting the archive branch or reconstructing old behavior from documentation.

A production rollback runbook must eventually record the exact Cloudflare deployment action and required environment/bindings after those are verified through the platform.
