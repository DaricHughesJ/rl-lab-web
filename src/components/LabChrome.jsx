import { useState } from 'react'
import '../MarketingV2.css'
import '../LabPages.css'

function Brand() {
  return (
    <a className="v2-brand" href="/" aria-label="MechLab home">
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

export default function LabChrome({ active, children }) {
  const [menu, setMenu] = useState(false)

  return (
    <main className="marketing-v2 lab-page" id="top">
      <nav className="v2-nav">
        <Brand />
        <div id="v2-mobile-nav" className={`v2-links${menu ? ' open' : ''}`}>
          <a href="/#app" onClick={() => setMenu(false)}>The app</a>
          <a href="/#mechanics" onClick={() => setMenu(false)}>Mechanics</a>
          <a
            className={active === 'roadmap' ? 'active' : undefined}
            href="/roadmap"
            onClick={() => setMenu(false)}
          >
            Roadmap
          </a>
          <a
            className={active === 'blog' ? 'active' : undefined}
            href="/blog"
            onClick={() => setMenu(false)}
          >
            Blog
          </a>
          <a className="v2-mobile-login" href="/signin" onClick={() => setMenu(false)}>Sign in</a>
          <a className="v2-mobile-login" href="/signup" onClick={() => setMenu(false)}>Join alpha</a>
        </div>
        <div className="v2-nav-actions">
          <a className="v2-login" href="/signin">Sign in</a>
          <a className="v2-button compact" href="/signup">Join alpha</a>
          <button
            type="button"
            className="v2-menu"
            aria-label={menu ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menu}
            aria-controls="v2-mobile-nav"
            onClick={() => setMenu((open) => !open)}
          >
            {menu ? '×' : '☰'}
          </button>
        </div>
      </nav>

      {children}

      <footer className="v2-footer">
        <Brand />
        <p>Windows app for Rocket League mechanics.</p>
        <div>
          <a href="/roadmap">Roadmap</a>
          <a href="/blog">Blog</a>
          <a href="mailto:support@mechlab.gg">Support</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Alpha terms</a>
        </div>
        <small>© 2026 MechLab · Not affiliated with Psyonix or Epic Games · Active development</small>
      </footer>
    </main>
  )
}
