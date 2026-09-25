import { useEffect, useState } from 'react'
import './App.css'
import './MarketingV2.css'
import './ReplayCoach.css'
import AuthModal from './components/AuthModal'
import UserDashboard from './components/UserDashboard'
import LaunchSurvey from './components/LaunchSurvey'
import { supabase } from './lib/supabase'
import { shipped as current, underTest as validation, queued as next } from './lib/labQueue'
import homeScreen from './assets/mechlab-home.webp'
import trainScreen from './assets/mechlab-train.webp'

const mechanics = [
  {
    id: 'FA-01',
    name: 'Fast Aerial',
    description: 'Jump, boost, air roll. We measure launch timing and how clean the flight path stays.',
    image: '/mechanics/fast-aerial.svg',
  },
  {
    id: 'WD-02',
    name: 'Wave Dash',
    description: 'Dodge into the ground for speed. We track the land, the cancel, and whether you keep the ball.',
    image: '/mechanics/wave-dash.svg',
  },
  {
    id: 'HF-03',
    name: 'Half Flip',
    description: 'Flip cancel, recover, face upfield. We time the turn and the first useful input after.',
    image: '/mechanics/half-flip.svg',
  },
]

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

function authResult() {
  const hash = new URLSearchParams(location.hash.slice(1))
  const query = new URLSearchParams(location.search)
  const error = hash.get('error_description') || query.get('error_description')
  if (error) return { type: 'error', message: error.replaceAll('+', ' ') }
  if (hash.get('access_token') || query.get('code')) {
    return { type: 'success', message: 'Email confirmed. You can sign in.' }
  }
  return null
}

function App() {
  const [result, setResult] = useState(null)
  const [menu, setMenu] = useState(false)
  const [authMode, setAuthMode] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(supabase))
  const isLaunchSurvey = window.location.pathname.replace(/\/+$/, '') === '/launch-survey'

  useEffect(() => {
    setResult(authResult())
    let subscription
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        setUser(data.session?.user || null)
        setLoading(false)
      })
      subscription = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      }).data.subscription
    } else {
      setLoading(false)
    }
    return () => subscription?.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="app-loading">
        <img className="v2-loading-mark" src="/brand/mechlab-wordmark-nav.webp" alt="mechlab" width="155" height="56" />
        <i />
      </div>
    )
  }

  if (user) return isLaunchSurvey
    ? <LaunchSurvey user={user}/>
    : <UserDashboard user={user} onExit={() => setUser(null)} />

  if (isLaunchSurvey) return <div className="app-loading"><p>Sign in to access the MechLab launch survey.</p><AuthModal initialMode="login" onClose={() => { window.location.href = '/' }}/></div>

  return (
    <>
      <main className="marketing-v2" id="top">
        <nav className="v2-nav">
          <Brand />
          <div id="v2-mobile-nav" className={`v2-links${menu ? ' open' : ''}`}>
            <a href="#app" onClick={() => setMenu(false)}>The app</a>
            <a href="#mechanics" onClick={() => setMenu(false)}>Mechanics</a>
            <a href="/roadmap" onClick={() => setMenu(false)}>Roadmap</a>
            <a href="/blog" onClick={() => setMenu(false)}>Blog</a>
            <button className="v2-mobile-login" onClick={() => { setMenu(false); setAuthMode('login') }}>Sign in</button>
            <button className="v2-mobile-login" onClick={() => { setMenu(false); setAuthMode('signup') }}>Join alpha</button>
          </div>
          <div className="v2-nav-actions">
            <button className="v2-login" onClick={() => setAuthMode('login')}>Sign in</button>
            <button className="v2-button compact" onClick={() => setAuthMode('signup')}>Join alpha</button>
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

        {result && (
          <section className={`v2-auth ${result.type}`}>
            <div>
              <b>ACCOUNT</b>
              <h2>{result.type === 'success' ? 'Email confirmed' : 'Link failed'}</h2>
              <p>{result.message}</p>
            </div>
            <button onClick={() => { history.replaceState(null, '', '/'); setResult(null) }}>Dismiss</button>
          </section>
        )}

        <section className="v2-hero" aria-label="MechLab introduction">
          <div className="v2-hero-media" aria-hidden="true">
            <img src={homeScreen} alt="" />
            <div className="v2-hero-shade" />
          </div>
          <div className="v2-hero-copy">
            <p className="v2-specimen">WINDOWS DESKTOP · ALPHA</p>
            <img
              className="v2-hero-brand"
              src="/brand/mechlab-wordmark.webp"
              alt="mechlab"
              width="664"
              height="240"
            />
            <h1>Train mechanics.<br /><em>See what actually happened.</em></h1>
            <p className="v2-lede">
              MechLab is a Windows app for Rocket League mechanics. You run a drill, we record the rep, then you review timing, inputs, and path.
            </p>
            <div className="v2-actions">
              <button className="v2-button primary" onClick={() => setAuthMode('signup')}>
                Join the alpha <span>→</span>
              </button>
              <a href="#app">See the app <span>↓</span></a>
            </div>
            <dl className="v2-readouts">
              <div><dt>PLATFORM</dt><dd>Windows 10/11</dd></div>
              <div><dt>APP</dt><dd>Desktop</dd></div>
              <div><dt>STATUS</dt><dd>Alpha</dd></div>
            </dl>
          </div>
        </section>

        <section className="v2-section v2-app-section" id="app">
          <div className="v2-heading">
            <p>01 / THE APP</p>
            <h2>Real screens from the build.</h2>
            <span>Screenshots from the current Windows desktop app. No fake charts. No sample ranks.</span>
          </div>
          <div className="v2-screen-grid">
            <figure className="v2-app-shot">
              <div className="v2-windowbar"><i /><i /><i /><span>HOME · STATUS + LAUNCH</span></div>
              <img src={homeScreen} alt="Current MechLab Home screen" loading="lazy" />
              <figcaption>Home: system checks and overlay control.</figcaption>
            </figure>
            <figure className="v2-app-shot">
              <div className="v2-windowbar"><i /><i /><i /><span>TRAIN · PICK A MECHANIC</span></div>
              <img src={trainScreen} alt="Current MechLab Train screen" loading="lazy" />
              <figcaption>Train: pick a mechanic after bind check.</figcaption>
            </figure>
          </div>
        </section>

        <section className="v2-section v2-mechanics" id="mechanics">
          <div className="v2-heading centered">
            <p>MECHANICS · LIVE NOW</p>
            <h2>Three drills to start.<br /><em>More later.</em></h2>
            <span>
              Each drill is a repeatable test: same mechanic, same capture, numbers you can compare between sessions.
            </span>
          </div>
          <div className="v2-mechanic-grid">
            {mechanics.map((m) => (
              <article className="v2-mechanic" key={m.name}>
                <div className="v2-mechanic-art">
                  <img src={m.image} alt="" loading="lazy" />
                  <span className="v2-specimen-tag">{m.id}</span>
                </div>
                <div className="v2-mechanic-copy">
                  <h3>{m.name}</h3>
                  <p>{m.description}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="v2-mechanics-note">3 mechanics live · more in development</p>
        </section>

        <section className="v2-section v2-replay" id="replay">
          <div className="v2-replay-copy">
            <p>REPLAY</p>
            <h2>Review the session.<br /><em>See where it broke.</em></h2>
            <span>
              Replay Coach lines up inputs, telemetry, and notes on one timeline. Scrub a finished attempt, mark the miss, and take one change into the next run.
            </span>
            <ul className="v2-replay-points">
              <li>
                <b>Honest playback</b>
                <span>Missing frames stay missing. We do not invent motion between samples.</span>
              </li>
              <li>
                <b>One place to look</b>
                <span>Timeline, cameras, and notes stay together.</span>
              </li>
              <li>
                <b>Works offline</b>
                <span>Saved reports open without Rocket League running.</span>
              </li>
            </ul>
          </div>
          <figure className="v2-replay-shot">
            <img
              src="/replay-coach-product-v1.webp"
              alt="Replay Coach preview with path, readouts, and timeline."
              loading="lazy"
              width="1600"
              height="900"
            />
            <figcaption>Replay Coach preview</figcaption>
          </figure>
        </section>

        <section className="v2-section v2-status" id="status">
          <div className="v2-heading">
            <p>02 / STATUS</p>
            <h2>What works now.<br /><em>What is still unfinished.</em></h2>
            <span>This is alpha. Unfinished features stay labeled unfinished.</span>
          </div>
          <div className="v2-status-block live">
            <header>
              <span>●</span>
              <div>
                <b>SHIPPING NOW</b>
                <small>in the desktop app</small>
              </div>
            </header>
            <div className="v2-status-grid">
              {current.map(([title, text]) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="v2-status-split">
            <div className="v2-status-block validation">
              <header>
                <span>◆</span>
                <div>
                  <b>BUILT · UNDER TEST</b>
                  <small>do not treat as finished</small>
                </div>
              </header>
              {validation.map(([title, text]) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
            <div className="v2-status-block next" id="next">
              <header>
                <span>○</span>
                <div>
                  <b>NOT DONE YET</b>
                  <small>planned or incomplete</small>
                </div>
              </header>
              {next.map(([title, text]) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="v2-cta">
          <div>
            <p>ALPHA</p>
            <h2>Need players who will break it.</h2>
            <span>Run sessions and tell us where the numbers are wrong. We are still hardening launch, train, detect, score, save, and review.</span>
          </div>
          <button className="v2-button primary" onClick={() => setAuthMode('signup')}>
            Request access <span>→</span>
          </button>
        </section>

        <footer className="v2-footer">
          <Brand />
          <p>Windows app for Rocket League mechanics.</p>
          <div>
            <button onClick={() => setAuthMode('login')}>Sign in</button>
            <a href="/roadmap">Roadmap</a>
            <a href="/blog">Blog</a>
            <a href="mailto:support@mechlab.gg">Support</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Alpha terms</a>
          </div>
          <small>© 2026 MechLab · Not affiliated with Psyonix or Epic Games · Active development</small>
        </footer>
      </main>
      {authMode && <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)} />}
    </>
  )
}

export default App
