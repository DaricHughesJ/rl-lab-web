# ADR 0003: Routing and Rendering — React Router v8 on Cloudflare Workers

- Status: Accepted
- Date: 2026-09-05
- Scope: MechLab public website and authenticated web application

## Context

The current site is a React/Vite SPA with manual pathname dispatch for legal pages, anchor navigation for most public content, and local tab state for the authenticated dashboard. MechLab needs stable URLs, direct-load behavior, server-rendered public content for search/social/first response, a client-rich authenticated application, typed route boundaries, code splitting, and direct integration with the existing Cloudflare Worker/R2 platform.

The architecture should not add a second web framework merely to obtain static output if edge SSR satisfies the product requirements with lower migration risk.

## Options considered

### A. React Router v8 Framework Mode + Cloudflare Vite plugin

Advantages:

- first-class official Cloudflare Workers integration;
- React remains the UI model already used by the product;
- typed route modules/links and route-level code splitting;
- SSR runs in the Workers runtime through the official Cloudflare Vite integration;
- Cloudflare bindings remain available to trusted server code;
- straightforward path from the current Vite/React codebase;
- mature routing lineage and lower framework-change risk than adopting a second, newer application framework.

Tradeoffs:

- Cloudflare's current React Router v8 integration does not support SPA mode or prerendering when using the Cloudflare Vite plugin;
- public pages therefore use SSR rather than build-time static prerendering;
- migration requires replacing manual route/tab state and integrating the current protected API behavior into the framework Worker boundary.

### B. TanStack Start + Cloudflare Vite plugin

Advantages:

- official Cloudflare integration;
- SSR plus supported build-time static prerendering;
- strong typed routing/data APIs.

Tradeoffs:

- larger framework migration from the existing application;
- newer full-stack framework surface and additional product/tooling risk;
- static prerendering is useful but not a sufficient reason by itself to replace the routing/application model when Cloudflare edge SSR satisfies MechLab's public-content requirements.

### C. Keep React SPA + routing library only

Advantages:

- smallest migration;
- current Worker API/static asset architecture remains nearly unchanged.

Tradeoffs:

- public content remains client-rendered unless a separate rendering layer is added;
- adding a bespoke prerender/SSR system would increase custom infrastructure and create another architecture to maintain;
- weaker fit for the intended public-site route/metadata model.

### D. Separate marketing framework and dashboard SPA

Advantages:

- each surface can optimize independently.

Tradeoffs:

- duplicate build/deployment/design/auth integration;
- more packages and release surfaces than current scale justifies;
- unnecessary microfrontend complexity.

## Decision

Use **React Router v8 in Framework Mode with the official Cloudflare Vite plugin** as the target routing/rendering architecture.

- Public product/legal/marketing routes are server-rendered on Cloudflare Workers.
- Public responses may use deliberate CDN/edge caching where content semantics allow; SSR does not imply every request must regenerate uncached HTML.
- Authenticated `/app/*` routes remain interaction-heavy React surfaces and should avoid unnecessary server work after bootstrap.
- The existing protected release/API behavior remains trusted Worker/server behavior and must retain compatibility tests during integration.
- Do not adopt TanStack Start solely for prerendering.
- Do not build a custom SSR/prerender system around raw Vite unless a documented framework limitation forces reassessment.

## Why this is the strongest practical choice

MechLab already has React, Vite, Cloudflare Workers, R2, and Supabase. React Router v8 is an officially supported Cloudflare full-stack path and reaches the required product outcomes—stable typed routes, SSR, code splitting, Worker bindings, and direct-load behavior—while changing fewer architectural dimensions at once.

Build-time prerendering would be useful for some marketing pages but is not currently a requirement that outweighs framework stability and migration risk. Cloudflare edge SSR plus controlled caching provides a high-performance public delivery model without introducing a second framework.

## Consequences

Target project structure should converge toward the framework layout expected by the Cloudflare integration, including route modules, server entry/Worker ownership, framework config, typed Vite config, and explicit route definitions.

The migration must preserve:

- `/privacy` and `/terms` stable URLs;
- existing auth/session behavior until replaced by tested route-aware behavior;
- protected beta-download authorization;
- current R2 binding/release contract;
- existing public anchor compatibility where external links may exist.

## Validation gates

Before removing the SPA/manual-routing implementation:

1. direct navigation/refresh succeeds for canonical public and `/app/*` routes;
2. public route HTML contains meaningful content and metadata in the initial response;
3. auth callback/recovery flows are covered end-to-end;
4. unauthorized beta download remains rejected and approved-user download remains functional;
5. visual reference pages remain within approved regression thresholds;
6. rollback to the preserved pre-migration baseline is documented and tested.

## Revisit conditions

Reassess this ADR if:

- Cloudflare removes/changes official React Router support materially;
- edge SSR cost/latency becomes a measured problem that caching cannot solve;
- MechLab requires large-scale static content generation that materially benefits from prerendering;
- a proven framework limitation forces substantial custom infrastructure;
- the authenticated web product diverges enough from the public site that separate deployments become demonstrably simpler, not merely theoretically cleaner.
