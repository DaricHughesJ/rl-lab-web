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
        <div className={`v2-links${menu ? ' open' : ''}`}>
          <a href="/#app" onClick={() => setMenu(false)}>Instruments</a>
          <a href="/#mechanics" onClick={() => setMenu(false)}>Protocols</a>
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
            Dev blog
          </a>
          <a className="v2-mobile-login" href="/signin" onClick={() => setMenu(false)}>Sign in</a>
        </div>
        <div className="v2-nav-actions">
          <a className="v2-login" href="/signin">Sign in</a>
          <a className="v2-button compact" href="/signup">Request bench access</a>
          <button
            className="v2-menu"
            type="button"
            aria-label={menu ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? '×' : '☰'}
          </button>
        </div>
      </nav>

      {children}

      <footer className="v2-footer">
        <Brand />
        <p>Desktop lab for Rocket League mechanics.</p>
        <div>
          <a href="/roadmap">Roadmap</a>
          <a href="/blog">Dev blog</a>
          <a href="mailto:support@mechlab.gg">Support</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Beta terms</a>
        </div>
        <small>© 2026 MECHLAB · Not affiliated with Psyonix or Epic Games · ACTIVE DEVELOPMENT</small>
      </footer>
    </main>
  )
}
