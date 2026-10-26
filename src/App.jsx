import { useEffect, useState } from 'react'
import './App.css'
import './MarketingV2.css'
import './ReplayCoach.css'
import AuthModal from './components/AuthModal'
import UserDashboard from './components/UserDashboard'
import LaunchSurvey from './components/LaunchSurvey'
import { supabase } from './lib/supabase'
import replayCoach from './assets/mechlab-replay-coach-real.webp'
import replayInputs from './assets/mechlab-replay-inputs-real.webp'
import practiceScreen from './assets/mechlab-practice-beta.webp'

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
            <button className="v2-mobile-login" onClick={() => { setMenu(false); setAuthMode('signup') }}>Join the beta</button>
          </div>
          <div className="v2-nav-actions">
            <button className="v2-login" onClick={() => setAuthMode('login')}>Sign in</button>
            <button className="v2-button compact" onClick={() => setAuthMode('signup')}>Join the beta</button>
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
            <p className="v2-specimen">WINDOWS DESKTOP APP · BETA</p>
            <img
              className="v2-hero-brand"
              src="/brand/mechlab-wordmark.webp"
              alt="mechlab"
              width="664"
              height="240"
            />
            <h1>Train mechanics.<br /><em>See what actually happened.</em></h1>
            <p className="v2-lede">
              Pick a mechanic and play a rep in Rocket League. MechLab scores it from the game itself, shows you what went wrong, and gives you one thing to change on the next one.
            </p>
            <div className="v2-actions">
              <button className="v2-button primary" onClick={() => setAuthMode('signup')}>
                Join the beta <span>→</span>
              </button>
              <a href="#app">See the app <span>↓</span></a>
            </div>
          </div>
          <figure className="site-hero-capture"><img src={replayCoach} alt="Replay Coach on a real Fast Aerial rep: the car and ball at the key moment, the jump timeline, and the coach naming the stick position at the second jump" width="1600" height="900"/><figcaption>Replay Coach · a real Fast Aerial rep</figcaption></figure>
        </section>

        <section className="v2-section v2-app-section" id="app">
          <div className="v2-heading">
            <p>01 / THE APP</p>
            <h2>Real screens from the app.</h2>
            <span>Pick a mechanic, play it, then see exactly what your hands did.</span>
          </div>
          <div className="v2-screen-grid">
            <figure className="v2-app-shot">
              <div className="v2-windowbar"><i /><i /><i /><span>PRACTICE</span></div>
              <img src={practiceScreen} alt="MechLab Practice screen: the list of 15 mechanics and how the selected one is done" loading="lazy" width="1600" height="1000" />
              <figcaption>Practice: pick a mechanic and see how the rep is done.</figcaption>
            </figure>
            <figure className="v2-app-shot">
              <div className="v2-windowbar"><i /><i /><i /><span>REPLAY COACH · INPUTS</span></div>
              <img src={replayInputs} alt="Replay Coach inputs tab on a real Fast Aerial rep: left stick path, buttons pressed, and the jump timeline" loading="lazy" width="1366" height="768" />
              <figcaption>Replay Coach: your stick and buttons on the same clock as the car.</figcaption>
            </figure>
          </div>
        </section>

        <section className="v2-section v2-mechanics" id="mechanics">
          <div className="v2-heading centered">
            <p>MECHANICS · 15</p>
            <h2>Fifteen mechanics.<br /><em>One practice loop.</em></h2>
            <span>
              From movement basics to aerials, resets and shots. Each one is scored from game data and coached step by step.
            </span>
          </div>
          <ul className="mechanic-list">
            {mechanics.map((name, index) => <li key={name}><span>{String(index + 1).padStart(2, '0')}</span>{name}</li>)}
          </ul>
        </section>

        <section className="v2-section v2-replay" id="replay">
          <div className="v2-replay-copy">
            <p>REPLAY</p>
            <h2>Review the session.<br /><em>See where it broke.</em></h2>
            <span>
              Replay Coach puts your stick, buttons and the car on one timeline. Scrub to the miss, see what your hands did, and take one change into the next rep.
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
          <figure className="v2-replay-finding" aria-label="Coaching from a real Fast Aerial rep">
            <header><b>FAST AERIAL · ATTEMPT 1</b><span>Second-jump stick</span></header>
            <p className="v2-finding-lead">At jump 2 the stick was 0.99 deflected. The dodge deadzone needs it at 0.40 or less, so the second press became a dodge instead of a straight jump.</p>
            <dl>
              <div><dt>You</dt><dd>0.99 deflected at the second press</dd></div>
              <div><dt>Target</dt><dd>0.40 or less</dd></div>
              <div><dt>Timing</dt><dd>Jump 2 came 349 ms after jump 1, 49 ms late</dd></div>
            </dl>
            <p className="v2-finding-next"><b>Next rep:</b> ease the stick toward centre for the second press, then pull back.</p>
            <figcaption>From a real rep in Replay Coach. The same fix shows on the in-game overlay right after the rep.</figcaption>
          </figure>
        </section>

        <section className="v2-section v2-status" id="status">
          <div className="v2-heading">
            <p>THE MECHLAB LOOP</p>
            <h2>From first input<br /><em>to the next clean rep.</em></h2>
            <span>Pick, play, read the cue, fix one thing, go again.</span>
          </div>
          <div className="capability-grid">
            <article><span>01 / PICK</span><h3>Fifteen mechanics.</h3><p>Each one comes with how it’s done, where it usually goes wrong, and a clean rep to watch.</p></article>
            <article><span>02 / PLAY</span><h3>Practice in Free Play or a training pack.</h3><p>MechLab reads the game while you play, so you don’t tab out or log anything.</p></article>
            <article><span>03 / CUE</span><h3>One fix per rep.</h3><p>After each rep the overlay shows your score and the single change that helps most. A missed rep says Missed, not a fake number.</p></article>
            <article><span>04 / READ</span><h3>See what your hands did.</h3><p>Replay Coach shows your stick and buttons next to the car, at the moment it went wrong.</p></article>
            <article><span>05 / TRY</span><h3>Test a fix before you play it.</h3><p>The simulator replays your rep with a small change and shows where the car would have gone. It’s always labelled as a prediction.</p></article>
            <article><span>06 / YOUR DATA</span><h3>You choose what leaves your PC.</h3><p>Syncing progress and sharing reps are both your call, and you can erase your account data any time.</p></article>
          </div>
          <a className="ahead-link" href="/roadmap">See what we’re building next <span>→</span></a>
        </section>

        <section className="v2-cta">
          <div>
            <p>BETA</p>
            <h2>Need players who will break it.</h2>
            <span>Get in early, tell us what’s wrong, and shape what MechLab becomes.</span>
          </div>
          <button className="v2-button primary" onClick={() => setAuthMode('signup')}>
            Join the beta <span>→</span>
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
