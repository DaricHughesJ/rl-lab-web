# Release Delivery Contract

## Current protected-download behavior

The existing web Worker implements the following security boundary and it must be preserved through refactoring:

```text
browser request
   |
Bearer session required
   |
Supabase user validation
   |
profile beta_access check
   |
release metadata lookup
   |
safe versioned R2 object-key selection
   |
private R2 object retrieval
   |
response with release metadata headers
```

The R2 binding is private infrastructure. The website must not publish direct unrestricted beta object URLs as a replacement for this authorization flow.

## Target release model

A release consists of:

- immutable versioned binary object;
- version;
- tag where applicable;
- SHA-256 checksum;
- byte size;
- source commit;
- build/run identifier;
- publish timestamp;
- immutable object key;
- release notes/changelog reference where appropriate.

`latest` is a metadata pointer to a versioned release. Publishing a new release updates the pointer/manifest; it does not overwrite a previous versioned binary.

## Failure behavior

Protected release routes must have intentional responses for:

- missing bearer session;
- invalid/expired session;
- authenticated user without entitlement;
- malformed/disallowed object key;
- missing metadata;
- missing R2 object;
- upstream Supabase failure;
- unsupported HTTP method.

Do not leak secrets, bucket listings, arbitrary object keys, or bearer tokens in failures/logs.

## Migration rule

Worker modularization must retain compatibility with the currently deployed download flow until integration tests prove parity. Security refactoring and frontend redesign must not be coupled into one unreviewable change.
