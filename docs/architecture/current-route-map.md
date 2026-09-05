# Current Route and Experience Map

Status: W1 inventory. This documents the existing route-like behavior before routing is replaced.

## Current dispatch

`src/main.jsx` performs manual pathname dispatch. `/privacy` renders the privacy document, `/terms` renders beta terms, and every other pathname renders the main `App` surface. There is no production router yet.

The Cloudflare asset configuration uses SPA fallback, so unknown paths currently fall back to the application shell. That behavior must be made intentional when real routes are introduced.

## Public marketing surface

The current homepage is one long document with anchor navigation rather than independent public pages.

| Current location | Current owner | Intended target ownership |
| --- | --- | --- |
| `/#top` | `App.jsx` | `/` home |
| `/#product` | `App.jsx` | `/product` or home product section, decision required |
| `/#mechanics` | `App.jsx` | `/mechanics` |
| `/#insights` | `App.jsx` | `/product/coaching` or mechanics detail, decision required |
| `/#autolearn` | `App.jsx` | `/autolearn` |
| `/#workflow` | `App.jsx` | `/product` or home workflow section |
| `/#mobile` | `DevelopmentRoadmap.jsx` | `/mobile` |
| `/#roadmap` | `DevelopmentRoadmap.jsx` | `/roadmap` |
| `/#devlog` | `DevelopmentRoadmap.jsx` | `/changelog` or `/roadmap`, decision required |
| `/privacy` | manual dispatch + `LegalDocs.jsx` | stable `/privacy` route |
| `/terms` | manual dispatch + `LegalDocs.jsx` | stable `/terms` route |

Existing anchor URLs should continue to resolve or redirect during migration so public links are not broken unnecessarily.

## Authentication experiences

Authentication currently opens as modal state inside `App.jsx` rather than route state.

- sign up / beta request;
- sign in;
- forgot-password request;
- auth confirmation/error result parsed from query/hash;
- password recovery continuation;
- authenticated session detection and auth-state subscription.

Target routing should support intentional callback/recovery URLs rather than relying on the homepage to interpret every auth callback.

Recommended target ownership:

- `/auth/callback` — auth confirmation/exchange handling;
- `/auth/recovery` — password recovery continuation;
- login/signup may remain dialogs for UX, but callback state must have stable URLs and tests.

## Authenticated dashboard

`UserDashboard.jsx` currently implements tab state rather than URLs.

| Current tab | Current data/behavior | Target route |
| --- | --- | --- |
| `overview` | beta state, summary metrics, install wizard | `/app` |
| `mechanics` | latest synced mechanic progress | `/app/mechanics` |
| `sessions` | synced session list | `/app/sessions` |
| `profile` | profile, password, privacy/sync settings | `/app/account` |

Future product routes already anticipated by the architecture are `/app/replays`, `/app/downloads`, and `/app/devices`; they must not be exposed until backed by real product contracts.

## Routing invariants

1. Direct navigation and refresh must work for every canonical route.
2. Public routes must not require client auth boot before useful public content appears.
3. Authenticated routes must preserve the intended destination across sign-in where practical.
4. Route guards are UX only; authorization remains in RLS and/or trusted Worker code.
5. 404 handling must become explicit rather than relying indefinitely on catch-all `App` rendering.
6. Privacy/terms URLs are externally durable and must not be casually renamed.
7. Existing anchor links require compatibility redirects/anchors until external-link risk is understood.

## W3 migration sequence

1. Introduce router infrastructure without changing page content.
2. Preserve `/`, `/privacy`, and `/terms` first.
3. Move dashboard tabs to `/app/*` routes with auth restoration.
4. Split public sections into routes only where separate URLs improve product clarity, SEO, or maintainability.
5. Add explicit not-found handling.
6. Add browser/E2E direct-load tests before deleting manual dispatch and tab state.
