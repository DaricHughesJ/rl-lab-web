import { useEffect, useState } from 'react'
import './App.css'
import './MarketingV2.css'
import AuthModal from './components/AuthModal'
import UserDashboard from './components/UserDashboard'
import { supabase } from './lib/supabase'
import homeScreen from './assets/mechlab-home.webp'
import trainScreen from './assets/mechlab-train.webp'

const mechanics = [
  {
    name: 'Fast Aerial',
    description: 'Get to the ball faster. Improve timing, angle, and consistency.',
    tag: 'ALPHA 01',
  },
  {
    name: 'Wave Dash',
    description: 'Master the movement. Build speed and control.',
    tag: 'ALPHA 02',
  },
  {
    name: 'Half Flip',
    description: 'Turn around faster. Clean execution and recovery.',
    tag: 'ALPHA 03',
  },
]

const current = [
  ['SYSTEM STATUS', 'Engine, controller, Rocket League, overlay, and replay-storage health checks live on Home.'],
  ['TRAINING SURFACE', 'Choose one of the three alpha mechanics and start a mechanic-specific session.'],
  ['CALIBRATION GATE', 'MechLab requires the player’s actual Rocket League controller binds before trusting timing.'],
  ['OVERLAY CONTROL', 'Launch and stop the overlay from the desktop app instead of managing a separate workflow.'],
]

const validation = [
  ['REP DETECTION + SCORING', 'The engine path exists; accuracy and edge cases still need real-rep validation.'],
  ['COACHING OUTPUT', 'Feedback wiring exists, but coaching quality still has to be proven against captured reps.'],
  ['SESSION EVIDENCE', 'Session capture and save hooks are present; the complete end-to-end evidence loop is still being hardened.'],
]

const next = [
  ['REPLAY COACH', 'The desktop route exists today as a placeholder. Full review is not being presented as finished.'],
  ['PROGRESS', 'The route exists, but history and progress views wait on reliable recorded sessions.'],
  ['3D REVIEW', '3D replay reconstruction, measurements, drawing, and comparison tools are planned work—not a shipped feature.'],
]

function Brand() {
  return (
    <a className="v2-brand" href="#top" aria-label="MechLab home">
      mech<span>|</span>lab
      <small>TRAIN · ANALYZE · IMPROVE</small>
    </a>
  )
}

function authResult() {
  const h = new URLSearchParams(location.hash.slice(1))
  const q = new URLSearchParams(location.search)
  const e = h.get('error_description') || q.get('error_description')
  if (e) return { type: 'error', message: e.replaceAll('+', ' ') }
  if (h.get('access_token') || q.get('code')) {
    return { type: 'success', message: 'Your email is confirmed. You can return to MechLab and sign in.' }
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

  if (loading) return <div className="app-loading"><span className="v2-loading-mark">mech|lab</span><i /></div>
  if (user) return <UserDashboard user={user} onExit={() => setUser(null)} />

  return (
    <>
      <main className="marketing-v2" id="top">
        <nav className="v2-nav">
          <Brand />
          <div className={`v2-links${menu ? ' open' : ''}`}>
            <a href="#app" onClick={() => setMenu(false)}>App</a>
            <a href="#mechanics" onClick={() => setMenu(false)}>Mechanics</a>
            <a href="#status" onClick={() => setMenu(false)}>Build status</a>
            <a href="#next" onClick={() => setMenu(false)}>Next</a>
            <button className="v2-mobile-login" onClick={() => { setMenu(false); setAuthMode('login') }}>Log in</button>
          </div>
          <div className="v2-nav-actions">
            <button className="v2-login" onClick={() => setAuthMode('login')}>Log in</button>
            <button className="v2-button compact" onClick={() => setAuthMode('signup')}>Join beta</button>
            <button className="v2-menu" aria-label={menu ? 'Close navigation' : 'Open navigation'} onClick={() => setMenu(!menu)}>{menu ? '×' : '☰'}</button>
          </div>
        </nav>

        {result && (
          <section className={`v2-auth ${result.type}`}>
            <div><b>ACCOUNT STATUS</b><h2>{result.type === 'success' ? 'Email confirmed' : 'That link did not work'}</h2><p>{result.message}</p></div>
            <button onClick={() => { history.replaceState(null, '', '/'); setResult(null) }}>Dismiss</button>
          </section>
        )}

        <section className="v2-hero">
          <div className="v2-hero-copy">
            <p className="v2-kicker"><span>●</span> WINDOWS ALPHA · ACTIVE DEVELOPMENT</p>
            <h1>Train the mechanic.<br /><em>See what the rep did.</em></h1>
            <p className="v2-lede">MechLab is a Rocket League mechanics lab built around measurable reps: pick a mechanic, launch the overlay, train, and use captured evidence to understand what needs to change.</p>
            <div className="v2-actions">
              <button className="v2-button primary" onClick={() => setAuthMode('signup')}>Join the beta <span>→</span></button>
              <a href="#app">See the actual app <span>↓</span></a>
            </div>
            <div className="v2-facts">
              <span>WINDOWS 10/11</span><span>3 ALPHA MECHANICS</span><span>TAURI DESKTOP</span>
            </div>
          </div>
          <figure className="v2-app-shot hero-shot">
            <div className="v2-windowbar"><i /><i /><i /><span>CURRENT TAURI UI · HOME</span></div>
            <img src={homeScreen} alt="Current MechLab desktop Home interface" />
          </figure>
        </section>

        <section className="v2-strip">
          <span>NO CONCEPT DASHBOARD</span>
          <strong>THE WEBSITE NOW USES THE CURRENT DESKTOP UI</strong>
          <span>BUILD STATUS IS LABELED</span>
        </section>

        <section className="v2-section v2-app-section" id="app">
          <div className="v2-heading">
            <p>01 / CURRENT DESKTOP</p>
            <h2>The product should sell itself.<br /><em>So this is the product.</em></h2>
            <span>These surfaces mirror the current Tauri alpha instead of a fabricated dashboard or example performance data.</span>
          </div>
          <div className="v2-screen-grid">
            <figure className="v2-app-shot">
              <div className="v2-windowbar"><i /><i /><i /><span>HOME · STATUS + LAUNCH</span></div>
              <img src={homeScreen} alt="Current MechLab Home screen" loading="lazy" />
              <figcaption>Home exposes app health, overlay control, and the three supported alpha mechanics.</figcaption>
            </figure>
            <figure className="v2-app-shot">
              <div className="v2-windowbar"><i /><i /><i /><span>TRAIN · MECHANIC SELECTION</span></div>
              <img src={trainScreen} alt="Current MechLab Train screen" loading="lazy" />
              <figcaption>Train gates sessions on controller calibration and keeps the initial mechanic scope intentionally narrow.</figcaption>
            </figure>
          </div>
        </section>

        <section className="v2-section v2-mechanics" id="mechanics">
          <div className="v2-heading centered">
            <p>02 / ALPHA MECHANICS</p>
            <h2>Three mechanics.<br /><em>Measured deeply.</em></h2>
            <span>The desktop alpha source defines exactly these three mechanics.</span>
          </div>
          <div className="v2-mechanic-grid">
            {mechanics.map((mechanic, index) => (
              <article className="v2-mechanic" key={mechanic.name}>
                <div className={`v2-mechanic-art art-${index + 1}`} />
                <div className="v2-mechanic-copy">
                  <small>{mechanic.tag}</small>
                  <h3>{mechanic.name}</h3>
                  <p>{mechanic.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="v2-section v2-status" id="status">
          <div className="v2-heading">
            <p>03 / BUILD STATUS</p>
            <h2>Show what exists.<br /><em>Label what does not.</em></h2>
            <span>MechLab is still an alpha. The website should not make planned systems look finished.</span>
          </div>

          <div className="v2-status-block live">
            <header><span>●</span><div><b>IN THE CURRENT DESKTOP UI</b><small>implemented surface / wiring</small></div></header>
            <div className="v2-status-grid">
              {current.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </div>

          <div className="v2-status-split">
            <div className="v2-status-block validation">
              <header><span>◆</span><div><b>BUILT, STILL BEING PROVEN</b><small>do not treat as finished yet</small></div></header>
              {validation.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
            </div>
            <div className="v2-status-block next" id="next">
              <header><span>○</span><div><b>NEXT / NOT FINISHED</b><small>planned or placeholder surfaces</small></div></header>
              {next.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="v2-cta">
          <div>
            <p>MECHLAB ALPHA</p>
            <h2>Help prove the loop.</h2>
            <span>Launch → train → detect → score → save → review. That is the standard the alpha is being built toward.</span>
          </div>
          <button className="v2-button primary" onClick={() => setAuthMode('signup')}>Request beta access <span>→</span></button>
        </section>

        <footer className="v2-footer">
          <Brand />
          <p>Performance intelligence for Rocket League players.</p>
          <div><button onClick={() => setAuthMode('login')}>Tester sign in</button><a href="mailto:support@mechlab.gg">Support</a><a href="/privacy">Privacy</a><a href="/terms">Beta terms</a></div>
          <small>© 2026 MECHLAB · Not affiliated with Psyonix or Epic Games · ACTIVE DEVELOPMENT</small>
        </footer>
      </main>
      {authMode && <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)} />}
    </>
  )
}

export default App
