import { useState } from 'react'
import '../MarketingV2.css'
import '../LabPages.css'
import { withUtms } from '../lib/utm'
import { track } from '../lib/waitlist'

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

const LINKS = [
  { href: '/#how', label: 'How it works', id: 'how' },
  { href: '/#mechanics', label: 'Mechanics', id: 'mechanics' },
  { href: '/pricing', label: 'Pricing', id: 'pricing' },
  { href: '/compare', label: 'Compare', id: 'compare' },
  { href: '/faq', label: 'FAQ', id: 'faq' },
  { href: '/roadmap', label: 'Roadmap', id: 'roadmap' },
  { href: '/blog', label: 'Blog', id: 'blog' },
]

export default function LabChrome({ active, children, onSignIn }) {
  const [menu, setMenu] = useState(false)

  function go(href) {
    setMenu(false)
    track('cta_click', { href, place: 'nav' })
  }

  const early = withUtms('/waitlist')

  return (
    <main className="marketing-v2 lab-page" id="top">
      <nav className="v2-nav">
        <Brand />
        <div id="v2-mobile-nav" className={`v2-links${menu ? ' open' : ''}`}>
          {LINKS.map((l) => (
            <a
              key={l.id}
              className={active === l.id ? 'active' : undefined}
              href={l.href}
              onClick={() => go(l.href)}
            >
              {l.label}
            </a>
          ))}
          {onSignIn ? (
            <button className="v2-mobile-login" type="button" onClick={() => { setMenu(false); onSignIn() }}>Sign in</button>
          ) : (
            <a className="v2-mobile-login" href="/signin" onClick={() => go('/signin')}>Sign in</a>
          )}
          <a className="v2-mobile-login" href={early} onClick={() => go(early)}>Get early access</a>
        </div>
        <div className="v2-nav-actions">
          {onSignIn ? (
            <button className="v2-login" type="button" onClick={onSignIn}>Sign in</button>
          ) : (
            <a className="v2-login" href="/signin">Sign in</a>
          )}
          <a className="v2-button compact" href={early} onClick={() => track('cta_click', { href: early, place: 'nav_cta' })}>
            Get early access
          </a>
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
          <a href="/pricing">Pricing</a>
          <a href="/compare">Compare</a>
          <a href="/faq">FAQ</a>
          <a href={early}>Waitlist</a>
          <a href="/roadmap">Roadmap</a>
          <a href="/blog">Blog</a>
          <a href="mailto:support@mechlab.gg">Support</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Beta terms</a>
        </div>
        <small>© 2026 MechLab · Not affiliated with Psyonix or Epic Games · Active development</small>
      </footer>
    </main>
  )
}
