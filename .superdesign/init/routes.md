# Routes

SPA with path-based routing in `src/main.jsx` (no React Router).

```jsx
const path = window.location.pathname.replace(/\/+$/, '') || '/'
const blogMatch = path.match(/^\/blog(?:\/([^/]+))?$/)

const content = path === '/privacy'
  ? <LegalDocs type="privacy" />
  : path === '/terms'
    ? <LegalDocs type="terms" />
    : path === '/roadmap'
      ? <RoadmapPage />
      : blogMatch
        ? <DevBlogPage slug={blogMatch[1] || null} />
        : path === '/signin' || path === '/signup' || path === '/account'
          ? <AuthPage path={path} />
          : <App />
```

| Path | Component | Layout | Summary |
| --- | --- | --- | --- |
| `/` | `src/App.jsx` | Inline MarketingV2 nav/footer | Marketing home: hero, app screens, mechanics, Replay Coach, alpha status, CTA |
| `/roadmap` | `src/components/RoadmapPage.jsx` | LabChrome | Public roadmap buckets + horizons |
| `/blog` | `src/components/DevBlogPage.jsx` | LabChrome | Dev blog index |
| `/blog/:slug` | `src/components/DevBlogPage.jsx` | LabChrome | Single post |
| `/signin`, `/signup`, `/account` | `src/components/AuthPage.jsx` | Auth shell + AuthModal | Auth / waitlist signup |
| `/privacy`, `/terms` | `src/components/LegalDocs.jsx` | LabChrome (via LegalDocs) | Legal docs |
| (authed on `/`) | `src/components/UserDashboard.jsx` | Account shell | Post-login dashboard |

**Designed marketing route map (pathname SPA; implement later):**

| Path | Purpose |
| --- | --- |
| `/` | Home / landing |
| `/pricing` | Free / Pro / Founders |
| `/compare` | Debugger vs AI coach vs replay stats |
| `/faq` | Platform & trust FAQ |
| `/waitlist` | Early access waitlist (UTM preserved) |
| `/thanks` | Post-waitlist confirmation |
| `/signin` | Sign in |
| `/signup` | Join alpha / create account |
| `/blog` | Blog index |
| `/blog/:slug` | Autopsy-style post template |
| `/roadmap` | Public roadmap |
| `/privacy` | Privacy |
| `/terms` | Beta / alpha terms |

**Waitlist fields:** email (required); optional display name, rank band, primary mechanic focus, Discord handle, how they heard. Preserve UTM on CTA → `/waitlist`. Events (notes): `waitlist_submit`, `cta_click`, `page_view`.
