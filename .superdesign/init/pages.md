# Page dependency trees

## / (Home — MarketingV2)
Entry: `src/App.jsx`
Dependencies:
- `src/MarketingV2.css`
- `src/App.css` (AuthModal + loading)
- `src/ReplayCoach.css`
- `src/components/AuthModal.jsx`
  - `src/lib/supabase.js`
  - `src/lib/authVerification.js`
- `src/components/UserDashboard.jsx` (authed branch only)
- `src/lib/labQueue.js` (shipped / underTest / queued status copy)
- `src/assets/mechlab-home.webp`
- `src/assets/mechlab-train.webp`
- Public: `/brand/mechlab-wordmark-nav.webp`, `/brand/mechlab-wordmark.webp`
- Public: `/mechanics/fast-aerial.svg`, `/mechanics/wave-dash.svg`, `/mechanics/half-flip.svg`
- Public: `/replay-coach-product-v1.webp`

Sections rendered (desktop marketing branch): nav → optional auth banner → hero (full-bleed product image + wordmark + H1 + CTA) → The app screens → Mechanics grid → Replay Coach → Status buckets → Footer CTA → footer.

## /roadmap
Entry: `src/components/RoadmapPage.jsx`
Dependencies:
- `src/components/LabChrome.jsx`
  - `src/MarketingV2.css`
  - `src/LabPages.css`
- `src/lib/labQueue.js`

## /blog and /blog/:slug
Entry: `src/components/DevBlogPage.jsx`
Dependencies:
- `src/components/LabChrome.jsx`
- `src/content/devBlog.js`
- `src/LabPages.css` / `src/MarketingV2.css` (via LabChrome)

## /signin | /signup | /account
Entry: `src/components/AuthPage.jsx`
Dependencies:
- `src/components/AuthModal.jsx`
- `src/components/UserDashboard.jsx` (account + session)
- `src/App.css` (`.auth-page-shell`, modal)
- `src/lib/supabase.js`

## /privacy | /terms
Entry: `src/components/LegalDocs.jsx`
Dependencies:
- LabChrome / Marketing styles
