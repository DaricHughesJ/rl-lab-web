# Shared UI Components

Framework: React 19 + Vite SPA. No component library (no shadcn/MUI). Marketing UI uses custom CSS classes in `MarketingV2.css` / `LabPages.css`. Auth/modal styles live in `App.css`.

## Brand (inline in pages)

Used in `src/App.jsx` and `src/components/LabChrome.jsx`.

```jsx
function Brand() {
  return (
    <a className="v2-brand" href="#top" aria-label="MechLab home">
      <img
        className="v2-brand-word"
        src="/brand/mechlab-wordmark-nav.webp"
        alt="mechlab"
        width="155"
        height="56"
      />
    </a>
  )
}
```

## AuthModal

- Path: `src/components/AuthModal.jsx`
- Description: Modal for signup / sign-in / forgot password / email verification pending
- Key props: `initialMode` (`signup` | `login` | `forgot`), `onClose`

```jsx
export default function AuthModal({ initialMode = 'signup', onClose }) {
  // modes: signup | login | forgot; confirmationEmail shows verify-email state
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="auth-brand"><i>✦</i><span>ALPHA ACCESS | ACCOUNT RECOVERY | WELCOME BACK</span></div>
        <h2 id="auth-title">Join the MechLab alpha. | Reset your password. | Sign in to your account.</h2>
        <p>Intro copy by mode</p>
        {/* form: name/rank/platform (signup), email, password; CTA button.button.auth-submit */}
        <footer>Mode switch links</footer>
      </section>
    </div>
  )
}
```

Full source is in `src/components/AuthModal.jsx` (135 lines). Styles: `.modal-backdrop`, `.auth-modal`, `.button` in `src/App.css`.

## Buttons / primitives (CSS-only)

No shared React Button component. Marketing uses:

- `.v2-button` / `.v2-button.primary` / `.v2-button.compact` — clipped polygon CTAs (MarketingV2)
- `.button` — gradient CTA (App.css, auth/dashboard)

## Status blocks (marketing pattern)

Used on home and roadmap — not a separate component file; markup:

```html
<div class="v2-status-block live|validation|next">
  <header><span>●</span><div><b>LABEL</b><small>hint</small></div></header>
  <div class="v2-status-grid"><article><h3>…</h3><p>…</p></article></div>
</div>
```
