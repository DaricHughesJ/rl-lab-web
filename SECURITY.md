# Security Policy

MechLab Web handles authentication, user-owned training metadata, privacy preferences, beta entitlements, and protected release delivery. Security-sensitive changes require explicit review and testing.

## Report a vulnerability

Do not publish credentials, tokens, exploit details, private user information, or live-system secrets in a public issue. Use the private security/reporting channel configured for the project; if unavailable, contact the project owner/support privately.

## Trust boundaries

- Browser code is untrusted and user-controlled.
- Supabase Row Level Security is an authorization boundary for browser-accessible data.
- Cloudflare Worker code is a trusted server boundary for privileged web operations.
- R2 private release objects must remain inaccessible except through authorized delivery paths.
- GitHub/CI build and release credentials are privileged infrastructure.

## Required rules

- Never expose service-role, Worker, signing, webhook, or other privileged secrets in frontend bundles.
- Never treat hidden/disabled UI as authorization.
- Never log bearer/refresh tokens, passwords, API secrets, or sensitive credential material.
- Validate untrusted API, metadata, webhook, and object-storage inputs at trusted boundaries.
- Enforce least privilege for RLS and Worker credentials.
- Keep release binaries immutable and verify release identity/hash metadata.
- Use explicit CORS and security-header policies rather than permissive defaults as the hardened Worker lands.
- Security-sensitive refactors require compatibility tests before old enforcement is removed.

## Data/privacy review triggers

A review is required when adding or materially changing:

- collected user or training data;
- analytics/telemetry;
- research/training-data contribution;
- retention/deletion behavior;
- authentication providers or recovery flows;
- sharing/public-profile features;
- payment/subscription/entitlement systems;
- third-party processors;
- mobile/desktop account linking.

## Incident expectations

Production operations documentation must provide a path to identify deployed versions, revoke/rotate compromised credentials, disable affected endpoints/features, roll back releases, and investigate from structured logs without exposing additional secrets.
