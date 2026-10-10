import { useEffect, useState } from 'react'
import './App.css'
import './MarketingV2.css'
import './ReplayCoach.css'
import AuthModal from './components/AuthModal'
import UserDashboard from './components/UserDashboard'
import LaunchSurvey from './components/LaunchSurvey'
import { supabase } from './lib/supabase'

const mechanics = [
  'Fast Aerial', 'Flip Cancel', 'Speed Flip', 'Half Flip', 'Stall', 'Zap Dash',
  'Air Dribble', 'Flip Reset', 'Pop Reset', 'Rapid Reset', 'Wave Dash',
  'Ceiling Play', 'Musty Flick', 'Chain Dash', 'Double Tap',
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

  if (isLaunchSurvey) return <div className="app-loading"><p>Sign in to access the MechLab launch survey.</p><AuthModal initialMode="login" onClose={() => { supabase?.auth.getSession().then(({ data }) => { if (!data.session) window.location.href = '/' }) }}/></div>

  return (
    <>
      <main className="marketing-v2" id="top">
        <nav className="v2-nav">
          <Brand />
          <div id="v2-mobile-nav" className={`v2-links${menu ? ' open' : ''}`}>
            <a href="#app" onClick={() => setMenu(false)}>Product</a>
            <a href="#mechanics" onClick={() => setMenu(false)}>Mechanics</a>
            <a href="/pricing" onClick={() => setMenu(false)}>Pricing</a>
            <a href="/docs" onClick={() => setMenu(false)}>Guide</a>
            <a href="/faq" onClick={() => setMenu(false)}>FAQ</a>
            <a href="/roadmap" onClick={() => setMenu(false)}>What’s ahead</a>
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

        <section className="v2-hero site-hero" aria-label="MechLab introduction">
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
              Practice a mechanic, capture the rep, then inspect the inputs and game-state evidence MechLab actually saw.
            </p>
            <div className="v2-actions">
              <button className="v2-button primary" onClick={() => setAuthMode('signup')}>
                Join the alpha <span>→</span>
              </button>
              <a href="#app">See the app <span>↓</span></a>
            </div>
            <dl className="v2-readouts"><div><dt>PLATFORM</dt><dd>Windows</dd></div><div><dt>PRODUCT</dt><dd>Desktop app</dd></div><div><dt>STAGE</dt><dd>Alpha</dd></div></dl>
          </div>
          <div className="hero-readout" aria-label="MechLab training sequence">
            <p><span>01</span> PICK A MECHANIC</p>
            <p><span>02</span> RUN A REP</p>
            <p><span>03</span> REVIEW THE EVIDENCE</p>
          </div>
        </section>

        <section className="v2-section v2-app-section" id="app">
          <div className="v2-heading">
            <p>THE PRACTICE LOOP</p>
            <h2>Play the rep.<br /><em>Then see what happened.</em></h2>
            <span>MechLab links focused training with recorded inputs and game-state evidence for review.</span>
          </div>
          <div className="practice-steps">
            <article><span>01 / TRAIN</span><h3>Choose one mechanic.</h3><p>Start a focused session for the move you want to improve.</p></article>
            <article><span>02 / CAPTURE</span><h3>Keep the rep intact.</h3><p>Inputs and available game data are recorded on a shared timeline.</p></article>
            <article><span>03 / REVIEW</span><h3>Take one change forward.</h3><p>Replay the attempt, inspect what was measured, and make the next run count.</p></article>
          </div>
        </section>

        <section className="v2-section v2-mechanics" id="mechanics">
          <div className="v2-heading centered">
            <p>MECHANICS · 15 AVAILABLE</p>
            <h2>Fifteen mechanics.<br /><em>One practice loop.</em></h2>
            <span>
              Fifteen distinct mechanics are ready to train, from movement fundamentals to aerial plays, resets, and shots.
            </span>
          </div>
          <ul className="mechanic-list">
            {mechanics.map((name, index) => <li key={name}><span>{String(index + 1).padStart(2, '0')}</span>{name}<b>AVAILABLE</b></li>)}
          </ul>
          <p className="v2-mechanics-note">Pick your next mechanic. Build the rep. Run it again.</p>
        </section>

        <section className="v2-section v2-replay" id="replay">
          <div className="v2-replay-copy">
            <p>REPLAY</p>
            <h2>Review the session.<br /><em>See where it broke.</em></h2>
            <span>Scrub a finished attempt and compare its recorded inputs with available game telemetry. Gaps stay visible; playback does not invent missing motion.</span>
            <p className="replay-note">Replay Coach · Rocket League session review</p>
          </div>
        </section>

        <section className="v2-section v2-details-section" aria-labelledby="details-heading">
          <div className="v2-heading">
            <p>MORE OF THE LOOP</p>
            <h2 id="details-heading">The details, when you want them.</h2>
            <span>Open a section for more about how MechLab handles training, review, and your data.</span>
          </div>
          <div className="feature-accordion">
            <details><summary><span>01 / TRAIN</span><b>Fifteen mechanics, ready to run</b></summary><p>Choose the mechanic you want to work on and get straight into focused practice.</p></details>
            <details><summary><span>02 / COACH</span><b>One cue, matched to the moment</b></summary><p>Scoring and coaching share the active attempt window. Keybind-aware guides use your controls, and input references appear when the rep is ready for comparison.</p></details>
            <details><summary><span>03 / PLAY</span><b>Keep the cue beside the game</b></summary><p>Start with a guided first run, then keep the MechLab overlay and optional official match context close to the play.</p></details>
            <details><summary><span>04 / REVIEW</span><b>Inspect recorded inputs and game data</b></summary><p>Replay Coach lines up the attempt, stick heatmaps, controller-specific labels, and faithful FAR/DAR input during review and simulation.</p></details>
            <details><summary><span>05 / EXPERIMENT</span><b>Try a small change safely</b></summary><p>Corrected replays test a bounded input change in simulation, then continue with your original recorded controls.</p></details>
            <details><summary><span>06 / YOUR DATA</span><b>You choose what leaves your PC</b></summary><p>Control progress sync, analytics, and training-data contribution. Review queued uploads, retry when you choose, or erase account data.</p></details>
          </div>
        </section>

        <section className="v2-cta">
          <div>
            <p>ALPHA</p>
            <h2>Need players who will break it.</h2>
            <span>Train fifteen mechanics, review your sessions, and help shape what MechLab becomes next.</span>
            <a className="ahead-link" href="/roadmap">See what’s ahead <span>→</span></a>
          </div>
          <button className="v2-button primary" onClick={() => setAuthMode('signup')}>
            Request access <span>→</span>
          </button>
        </section>

        <footer className="v2-footer">
          <Brand />
          <p>Windows app for Rocket League mechanics.</p>
          <div>
            <a href="/pricing">Pricing</a>
            <a href="/docs">Guide</a>
            <a href="/faq">FAQ</a>
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
