import { useEffect, useState } from 'react'
import './App.css'
import './MarketingV2.css'
import './ReplayCoach.css'
import AuthModal from './components/AuthModal'
import UserDashboard from './components/UserDashboard'
import LaunchSurvey from './components/LaunchSurvey'
import { supabase } from './lib/supabase'
import homeScreen from './assets/mechlab-home.webp'
import trainScreen from './assets/mechlab-train.webp'
import homeCapture from './assets/mechlab-home-actual.png'
import overlayCapture from './assets/mechlab-live-overlay-example.png'
import stickHeatmap from './assets/mechlab-stick-heatmap-example.png'

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
          <figure className="site-hero-capture"><img src={homeCapture} alt="Screenshot of the MechLab desktop app Home screen"/><figcaption>Actual MechLab build · Home screen</figcaption></figure>
        </section>

        <section className="v2-section v2-app-section" id="app">
          <div className="v2-heading">
            <p>01 / THE APP</p>
            <h2>Real screens from the build.</h2>
            <span>Actual screenshots from the Windows app. The overlay and controller examples below use sample session data.</span>
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
              src={stickHeatmap}
              alt="Actual MechLab controller input replay screen with recorded stick-density heatmap."
              loading="lazy"
              width="1600"
              height="900"
            />
            <figcaption>Actual controller replay capture · example session data</figcaption>
          </figure>
        </section>

        <section className="v2-section overlay-proof">
          <div className="v2-heading"><p>INPUT OVERLAY</p><h2>See the cue while you train.</h2><span>A real capture from the MechLab overlay. Example session data shown; this is not a live feed.</span></div>
          <figure className="overlay-proof-image"><img src={overlayCapture} alt="MechLab training overlay with a Fast Aerial cue and example session status" loading="lazy"/><figcaption>MechLab overlay · sample session</figcaption></figure>
        </section>

        <section className="v2-section v2-status" id="status">
          <div className="v2-heading">
            <p>THE MECHLAB LOOP</p>
            <h2>From first input<br /><em>to the next clean rep.</em></h2>
            <span>MechLab brings your mechanic, live cue, captured inputs and session review into one Windows training flow.</span>
          </div>
          <div className="capability-grid">
            <article><span>01 / TRAIN</span><h3>Fifteen mechanics, ready to run.</h3><p>Choose the mechanic you want to work on and get straight into focused practice.</p></article>
            <article><span>02 / COACH</span><h3>One cue, matched to the moment.</h3><p>Scoring and coaching share the active attempt window. Keybind-aware guides use your controls, and input references appear when the rep is ready for comparison.</p></article>
            <article><span>03 / PLAY</span><h3>Keep the cue beside the game.</h3><p>Start with a guided first run, then keep the MechLab overlay and optional official match context close to the play.</p></article>
            <article><span>04 / READ</span><h3>See your sticks, not a guess.</h3><p>Replay Coach lines up the attempt, stick heatmaps, controller-specific labels, and faithful FAR/DAR input during review and simulation.</p></article>
            <article><span>05 / EXPERIMENT</span><h3>Try a small change safely.</h3><p>Corrected replays test a bounded input change in simulation, then continue with your original recorded controls.</p></article>
            <article><span>06 / YOUR DATA</span><h3>You choose what leaves your PC.</h3><p>Control progress sync, analytics, and training-data contribution. Review queued uploads, retry when you choose, or erase account data.</p></article>
          </div>
          <a className="ahead-link" href="/roadmap">See what we’re building next <span>→</span></a>
        </section>

        <section className="v2-cta">
          <div>
            <p>ALPHA</p>
            <h2>Need players who will break it.</h2>
            <span>Fifteen mechanics, live cues, controller heatmaps and replay review. Get in and shape what MechLab becomes next.</span>
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
