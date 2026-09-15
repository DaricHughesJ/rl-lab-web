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

**Not yet in codebase (strategy §23):** dedicated Pricing page, Compare vs AI coach page, standalone FAQ page — design as new targets; home may also embed pricing/FAQ sections.
