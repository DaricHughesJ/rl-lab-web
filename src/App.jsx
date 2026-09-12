import { useEffect, useState } from 'react'
import './App.css'
import './MarketingV2.css'
import './ReplayCoach.css'
import AuthModal from './components/AuthModal'
import UserDashboard from './components/UserDashboard'
import { supabase } from './lib/supabase'
import homeScreen from './assets/mechlab-home.webp'
import trainScreen from './assets/mechlab-train.webp'

const mechanics = [
  {
    id: 'FA-01',
    name: 'Fast Aerial',
    description: 'Jump, boost, air roll. We clock the launch window and how clean the path stays.',
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

const current = [
  ['BENCH STATUS', 'Home shows whether the engine, controller, Rocket League, overlay, and replay store are up.'],
  ['SPECIMEN PICK', 'Train lists the mechanics that are wired today and starts a session for the one you choose.'],
  ['BIND CHECK', 'We read your real Rocket League binds before we trust any timing numbers.'],
  ['OVERLAY', 'Start and stop the overlay from the desktop app. No second launcher.'],
]

const validation = [
  ['REP DETECTOR', 'The path that finds and scores a rep is in. Still needs messy real-world reps before we call it solid.'],
  ['COACH NOTES', 'Feedback can fire. Whether those notes are actually useful is still an open question.'],
  ['SESSION LOG', 'We can capture and save a session. The full train → save → reopen loop is still getting stress-tested.'],
]

const next = [
  ['REPLAY BENCH', 'Review UI exists. Full coaching + measurement workflow is still unfinished.'],
  ['PROGRESS LEDGER', 'Route is there. History only matters once sessions are reliable.'],
  ['3D TRACE', '3D review foundation is in. Drawing, compare, and polish are not.'],
]

function Brand() {
  return (
    <a className="v2-brand" href="#top" aria-label="MechLab home">
      mech<span>|</span>lab
      <small>MECHANICS LABORATORY</small>
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
        <span className="v2-loading-mark">mech|lab</span>
        <i />
      </div>
    )
  }

  if (user) return <UserDashboard user={user} onExit={() => setUser(null)} />

  return (
    <>
      <main className="marketing-v2" id="top">
        <nav className="v2-nav">
          <Brand />
          <div className={`v2-links${menu ? ' open' : ''}`}>
            <a href="#app" onClick={() => setMenu(false)}>Instruments</a>
            <a href="#mechanics" onClick={() => setMenu(false)}>Protocols</a>
            <a href="#status" onClick={() => setMenu(false)}>Lab notes</a>
            <a href="#next" onClick={() => setMenu(false)}>Queue</a>
            <button className="v2-mobile-login" onClick={() => { setMenu(false); setAuthMode('login') }}>Sign in</button>
          </div>
          <div className="v2-nav-actions">
            <button className="v2-login" onClick={() => setAuthMode('login')}>Sign in</button>
            <button className="v2-button compact" onClick={() => setAuthMode('signup')}>Request bench access</button>
            <button
              className="v2-menu"
              aria-label={menu ? 'Close navigation' : 'Open navigation'}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
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
            <p className="v2-specimen">SPECIMEN LOG · WINDOWS ALPHA</p>
            <p className="v2-hero-brand">mech<span>|</span>lab</p>
            <h1>Mechanics under glass.<br /><em>Stop guessing the miss.</em></h1>
            <p className="v2-lede">
              MechLab is a desktop lab for Rocket League mechanics. You run a protocol, we record the rep, then you look at what actually happened—timing, inputs, path—not a vibes score.
            </p>
            <div className="v2-actions">
              <button className="v2-button primary" onClick={() => setAuthMode('signup')}>
                Get on the bench <span>→</span>
              </button>
              <a href="#app">Open the instruments <span>↓</span></a>
            </div>
            <dl className="v2-readouts">
              <div><dt>PLATFORM</dt><dd>Win 10/11</dd></div>
              <div><dt>STACK</dt><dd>Tauri desktop</dd></div>
              <div><dt>STATE</dt><dd>Alpha · open notes</dd></div>
            </dl>
          </div>
        </section>

        <section className="v2-section v2-app-section" id="app">
          <div className="v2-heading">
            <p>01 / INSTRUMENT BENCH</p>
            <h2>This is the app.<br /><em>Not a mock.</em></h2>
            <span>Screenshots from the current Tauri build. No fake charts, no sample ranks.</span>
          </div>
          <div className="v2-screen-grid">
            <figure className="v2-app-shot">
              <div className="v2-windowbar"><i /><i /><i /><span>HOME · HEALTH + LAUNCH</span></div>
              <img src={homeScreen} alt="Current MechLab Home screen" loading="lazy" />
              <figcaption>Home: system checks and overlay control.</figcaption>
            </figure>
            <figure className="v2-app-shot">
              <div className="v2-windowbar"><i /><i /><i /><span>TRAIN · PROTOCOL SELECT</span></div>
              <img src={trainScreen} alt="Current MechLab Train screen" loading="lazy" />
              <figcaption>Train: pick a mechanic after bind calibration.</figcaption>
            </figure>
          </div>
        </section>

        <section className="v2-section v2-mechanics" id="mechanics">
          <div className="v2-heading centered">
            <p>PROTOCOLS · ACTIVE</p>
            <h2>Three mechanics on the rack.<br /><em>More in prep.</em></h2>
            <span>
              Each protocol is a repeatable test: same mechanic, same capture, numbers you can compare between sessions.
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
          <p className="v2-mechanics-note">n = 3 protocols live · additional protocols in development</p>
        </section>

        <section className="v2-section v2-replay" id="replay">
          <div className="v2-replay-copy">
            <p>01A / REVIEW SCOPE</p>
            <h2>Replay the trial.<br /><em>Keep the gaps honest.</em></h2>
            <span>
              Replay Coach lines up inputs, telemetry, and notes on one clock. You scrub a finished attempt, mark where it broke, and take one change into the next run.
            </span>
            <ul className="v2-replay-points">
              <li>
                <b>Honest playback</b>
                <span>Missing frames stay missing. We don’t invent motion between samples.</span>
              </li>
              <li>
                <b>One scope</b>
                <span>Timeline, cameras, and notes stay on the same surface.</span>
              </li>
              <li>
                <b>Offline OK</b>
                <span>Saved reports open without Rocket League running.</span>
              </li>
            </ul>
          </div>
          <figure className="v2-replay-shot">
            <img
              src="/replay-coach-product-v1.webp"
              alt="Replay Coach preview with trajectory, timeline, and camera controls."
              loading="lazy"
              width="1672"
              height="941"
            />
            <figcaption>Replay Coach · design preview</figcaption>
          </figure>
        </section>

        <section className="v2-section v2-status" id="status">
          <div className="v2-heading">
            <p>02 / LAB NOTES</p>
            <h2>What’s wired.<br /><em>What’s still wet.</em></h2>
            <span>Alpha means unfinished. We’d rather label that than dress it up.</span>
          </div>
          <div className="v2-status-block live">
            <header>
              <span>●</span>
              <div>
                <b>ON THE BENCH NOW</b>
                <small>shipping in the desktop UI</small>
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
                  <small>don’t treat as finished</small>
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
                  <b>QUEUE · NOT DONE</b>
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
            <p>ALPHA COHORT</p>
            <h2>Need players who’ll break it.</h2>
            <span>Run sessions, tell us where the numbers lie, help us harden the loop: launch → train → detect → score → save → review.</span>
          </div>
          <button className="v2-button primary" onClick={() => setAuthMode('signup')}>
            Request access <span>→</span>
          </button>
        </section>

        <footer className="v2-footer">
          <Brand />
          <p>Desktop lab for Rocket League mechanics.</p>
          <div>
            <button onClick={() => setAuthMode('login')}>Tester sign in</button>
            <a href="mailto:support@mechlab.gg">Support</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Beta terms</a>
          </div>
          <small>© 2026 MECHLAB · Not affiliated with Psyonix or Epic Games · ACTIVE DEVELOPMENT</small>
        </footer>
      </main>
      {authMode && <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)} />}
    </>
  )
}

export default App
