import { useEffect, useState } from 'react'
import './App.css'
import './MarketingV2.css'
import './ReplayCoach.css'
import AuthModal from './components/AuthModal'
import LabChrome from './components/LabChrome'
import UserDashboard from './components/UserDashboard'
import { supabase } from './lib/supabase'
import { captureUtms, withUtms } from './lib/utm'
import { track } from './lib/waitlist'
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

const steps = [
  ['01', 'Record', 'Record the attempt with your real binds'],
  ['02', 'Detect', 'Find where the attempt starts and ends'],
  ['03', 'Score', 'Score it and label confidence'],
  ['04', 'Note', 'Point to the frame that failed'],
  ['05', 'Reopen', 'Open the session again later'],
]

const compareRows = [
  ['What you look at', 'Each attempt', 'Sessions and lessons', 'Whole match'],
  ['Why an input failed', 'Core job', 'Partial', 'Weak'],
  ['Evidence you can reopen', 'Yes', 'Low', 'Charts'],
  ['Best fit', 'Mechanic grinders', 'Broad ranked climb', 'Game outcomes'],
]

const plans = [
  ['Free', '$0', '20 to 40 reps per week, 1 mechanic, local history'],
  ['Pro', '$12/mo', 'Unlimited reps, all live mechanics, full Replay Coach'],
  ['Founders', '$79 lifetime', 'First 500 players, early price locked, private feedback channel'],
]

const faqs = [
  ['Does this work online or in ranked?', 'No. Supported mode is Windows training with EAC off.'],
  ['Is this an AI coach?', 'No. MechLab measures each attempt and shows the evidence.'],
  ['What if a diagnosis is wrong?', 'If we are unsure, we say so. Tell us when a number is wrong.'],
  ['PC only?', 'Yes for alpha. Console is out of scope for now.'],
]

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
  const [authMode, setAuthMode] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(supabase))
  const early = withUtms('/waitlist')

  useEffect(() => {
    captureUtms()
    track('page_view', { page: 'home' })
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

  if (user) return <UserDashboard user={user} onExit={() => setUser(null)} />

  return (
    <>
      <LabChrome onSignIn={() => setAuthMode('login')}>
        {result && (
          <section className={`v2-auth ${result.type}`}>
            <div>
              <b>ACCOUNT</b>
              <h2>{result.type === 'success' ? 'Email confirmed' : 'Link failed'}</h2>
              <p>{result.message}</p>
            </div>
            <button type="button" onClick={() => { history.replaceState(null, '', '/'); setResult(null) }}>Dismiss</button>
          </section>
        )}

        <section className="v2-hero dbg-hero" aria-label="MechLab introduction">
          <div className="v2-hero-media" aria-hidden="true">
            <img src={homeScreen} alt="" />
            <div className="v2-hero-shade" />
          </div>
          <div className="v2-hero-copy">
            <p className="v2-specimen">WINDOWS DESKTOP · ALPHA · EAC-OFF TRAINING</p>
            <img
              className="v2-hero-brand"
              src="/brand/mechlab-wordmark.webp"
              alt="mechlab"
              width="664"
              height="240"
            />
            <h1>See why the rep failed.</h1>
            <p className="v2-lede">
              MechLab records each Rocket League mechanic attempt, then shows timing, inputs, and path so you can see what went wrong.
            </p>
            <div className="v2-actions">
              <a className="v2-button primary" href={early} onClick={() => track('cta_click', { href: early, place: 'hero' })}>
                Get early access <span>→</span>
              </a>
              <a href="#how">See how it works <span>↓</span></a>
            </div>
            <dl className="v2-readouts">
              <div><dt>PLATFORM</dt><dd>Windows 10/11</dd></div>
              <div><dt>MODE</dt><dd>EAC-off training</dd></div>
              <div><dt>STATUS</dt><dd>Alpha</dd></div>
            </dl>
          </div>
        </section>

        <section className="v2-section" id="problem">
          <div className="v2-heading">
            <p>PROBLEM</p>
            <h2>You know the mechanic.<br /><em>You still cannot name the error.</em></h2>
            <span>
              Blind freeplay burns hours. Tutorials teach theory. Neither tells you which input, timing, or contact failed on your last attempt.
            </span>
          </div>
        </section>

        <section className="v2-section dbg-evidence" id="evidence">
          <div className="v2-heading">
            <p>EVIDENCE</p>
            <h2>Same mechanic. One miss. One hit. Open both.</h2>
          </div>
          <div className="dbg-evidence-grid">
            <article className="dbg-panel fail">
              <p>FAILED REP</p>
              <h3>Launch late · boost start +42ms · path drift</h3>
              <span>Confidence: medium. Open the timeline.</span>
            </article>
            <article className="dbg-panel ok">
              <p>SUCCESS REP</p>
              <h3>Launch clean · boost on window · path holds</h3>
              <span>Take one change into the next attempt.</span>
            </article>
          </div>
        </section>

        <section className="v2-section" id="how">
          <div className="v2-heading">
            <p>HOW IT WORKS</p>
            <h2>Record, detect, score, note, then reopen.</h2>
          </div>
          <div className="dbg-steps">
            {steps.map(([n, title, text]) => (
              <article key={n}>
                <p>{n}</p>
                <h3>{title}</h3>
                <span>{text}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="v2-section v2-app-section" id="app">
          <div className="v2-heading">
            <p>DEMO · FAILED VS SUCCESS</p>
            <h2>Real screens from the Windows build.</h2>
            <span>Home, Train, and Replay Coach from the current app. No fake ranks.</span>
          </div>
          <div className="v2-screen-grid dbg-demo-grid">
            <figure className="v2-app-shot">
              <div className="v2-windowbar"><i /><i /><i /><span>HOME</span></div>
              <img src={homeScreen} alt="MechLab Home screen" loading="lazy" />
              <figcaption>Home: system checks and overlay control.</figcaption>
            </figure>
            <figure className="v2-app-shot">
              <div className="v2-windowbar"><i /><i /><i /><span>TRAIN</span></div>
              <img src={trainScreen} alt="MechLab Train screen" loading="lazy" />
              <figcaption>Train: pick a mechanic after bind check.</figcaption>
            </figure>
            <figure className="v2-app-shot">
              <div className="v2-windowbar"><i /><i /><i /><span>REPLAY COACH</span></div>
              <img src="/replay-coach-product-v1.webp" alt="Replay Coach preview" loading="lazy" width="1600" height="900" />
              <figcaption>Replay: timeline, path, and notes on one clock.</figcaption>
            </figure>
          </div>
        </section>

        <section className="v2-section v2-mechanics" id="mechanics">
          <div className="v2-heading centered">
            <p>MECHANICS · LIVE NOW</p>
            <h2>Three mechanics now.<br /><em>More after these hold up.</em></h2>
            <span>Each drill uses the same capture path so Tuesday and Friday mean the same thing.</span>
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
        </section>

        <section className="v2-section" id="trust">
          <div className="v2-heading">
            <p>TRUST</p>
            <h2>What ships. What we refuse to claim.</h2>
            <span>
              Windows desktop only. Training with EAC off. No online ranked overlay promise. If we are unsure, we say so. Every note links to evidence you can reopen.
            </span>
          </div>
        </section>

        <section className="v2-section" id="compare">
          <div className="v2-heading">
            <p>COMPARE</p>
            <h2>MechLab vs AI coach apps vs replay stats</h2>
          </div>
          <div className="dbg-table-wrap">
            <table className="dbg-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>MechLab</th>
                  <th>AI coach apps</th>
                  <th>Replay stats</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={`${row[0]}-${i}`} className={i === 1 ? 'hl' : undefined}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="dbg-inline-link"><a href="/compare">Full comparison →</a></p>
        </section>

        <section className="v2-section dbg-plans" id="pricing">
          <div className="v2-heading">
            <p>PRICING</p>
            <h2>Start free. Pay when you need more.</h2>
          </div>
          <div className="dbg-plan-grid">
            {plans.map(([name, price, detail], i) => (
              <article className={`dbg-plan${i === 1 ? ' featured' : ''}`} key={name}>
                <p>{name.toUpperCase()}</p>
                <h2>{price}</h2>
                <span>{detail}</span>
              </article>
            ))}
          </div>
          <p className="dbg-inline-link"><a href="/pricing">Pricing details →</a></p>
        </section>

        <section className="v2-section dbg-faq-list" id="faq">
          <div className="v2-heading">
            <p>FAQ</p>
            <h2>Common questions.</h2>
          </div>
          {faqs.map(([q, a]) => (
            <article key={q}>
              <h2>{q}</h2>
              <p>{a}</p>
            </article>
          ))}
          <p className="dbg-inline-link"><a href="/faq">More FAQ →</a></p>
        </section>

        <section className="v2-cta">
          <div>
            <p>ALPHA</p>
            <h2>Pick one mechanic. Get a real diagnosis.</h2>
            <span>Built for Champion to GC grinders on PC who train with EAC off. Waitlist is open.</span>
          </div>
          <a className="v2-button primary" href={early} onClick={() => track('cta_click', { href: early, place: 'footer_cta' })}>
            Get early access <span>→</span>
          </a>
        </section>
      </LabChrome>
      {authMode && <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)} />}
    </>
  )
}

export default App
