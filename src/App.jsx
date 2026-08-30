import { useEffect, useState } from 'react'
import './App.css'
import AuthModal from './components/AuthModal'
import InstallWizard from './components/InstallWizard'
import UserDashboard from './components/UserDashboard'
import { supabase } from './lib/supabase'

const mechanics = [
  ['Fast aerials', 'Jump timing, pitch depth, and boost coverage', 94],
  ['Speed flips', 'Dodge angle, cancel speed, and air-roll timing', 87],
  ['Half flips', 'Cancel precision and recovery consistency', 91],
]

const Chart = ({ lime }) => (
  <svg className="chart" viewBox="0 0 500 150" preserveAspectRatio="none">
    <defs>
      <linearGradient id={lime ? 'l' : 'p'} x2="0" y2="1">
        <stop stopColor={lime ? '#caff4a' : '#a873ff'} stopOpacity=".35" />
        <stop offset="1" stopColor={lime ? '#caff4a' : '#a873ff'} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path className="grid" d="M0 30H500M0 75H500M0 120H500" />
    <path
      fill={`url(#${lime ? 'l' : 'p'})`}
      d="M0 125C45 117 53 87 95 101s69-50 110-29 69-28 111-13 49-5 80-24 65 7 104-20v135H0z"
    />
    <path
      className={lime ? 'cl' : 'cp'}
      d="M0 125C45 117 53 87 95 101s69-50 110-29 69-28 111-13 49-5 80-24 65 7 104-20"
    />
  </svg>
)

const Logo = () => (
  <a className="brand" href="#top">
    <i />
    <b>MECH<span>LAB</span></b>
  </a>
)

function authResult() {
  const h = new URLSearchParams(location.hash.slice(1))
  const q = new URLSearchParams(location.search)
  const e = h.get('error_description') || q.get('error_description')
  if (e) return { type: 'error', message: e.replaceAll('+', ' ') }
  if (h.get('access_token') || q.get('code')) {
    return {
      type: 'success',
      message: 'Your email is confirmed. You can return to MechLab and sign in.',
    }
  }
  return null
}

function Dashboard() {
  return (
    <div className="visual">
      <div className="window">
        <aside><Logo /><i>⌁</i><i>⌗</i><i>◫</i><span>DH</span></aside>
        <div className="dash">
          <header>
            <div><small>PRODUCT PREVIEW</small><h3>Training ground</h3></div>
            <b>DEMO</b>
          </header>
          <div className="metrics">
            {[
              ['SESSION SCORE', '92', 'EXAMPLE'],
              ['ATTEMPTS', '48', 'REPS'],
              ['CONSISTENCY', '89%', 'EXAMPLE'],
            ].map((x) => (
              <div key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong><small>{x[2]}</small></div>
            ))}
          </div>
          <div className="dashgrid">
            <div className="chartcard">
              <label>INPUT PRECISION <b>PREVIEW</b></label>
              <Chart />
              <footer>0s　　5s　　10s　　15s</footer>
            </div>
            <div className="repcard">
              <label>EXAMPLE ATTEMPT</label>
              <div className="ring"><b>94</b><small>SCORE</small></div>
              <p>FAST AERIAL</p>
            </div>
          </div>
        </div>
      </div>
      <div className="float delay"><small>EXAMPLE INPUT DELAY</small><b>8.3<em>ms</em></b><i>Preview</i></div>
      <div className="float coach">✦ <p><small>EXAMPLE COACH FEEDBACK</small>What happened: second jump is late.<br /><b>Next rep: release 40 ms sooner.</b></p></div>
    </div>
  )
}

function Heading({ n, tag, title, text, center }) {
  return (
    <div className={'heading reveal ' + (center ? 'center' : '')}>
      <p className="eyebrow">{n && <b>{n}</b>} {tag}</p>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  )
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

  useEffect(() => {
    if (loading || user) return undefined
    const elements = [...document.querySelectorAll('.reveal')]
    if (!('IntersectionObserver' in window)) {
      elements.forEach((x) => x.classList.add('show'))
      return undefined
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('show')),
      { threshold: 0.1 },
    )
    elements.forEach((x) => observer.observe(x))
    return () => observer.disconnect()
  }, [loading, user])

  if (loading) return <div className="app-loading"><Logo /><i /></div>
  if (user) return <UserDashboard user={user} onExit={() => setUser(null)} />

  return (
    <>
      <main>
        <nav>
          <Logo />
          <div className={menu ? 'links open' : 'links'}>
            <a href="#product" onClick={() => setMenu(false)}>Product</a>
            <a href="#mechanics" onClick={() => setMenu(false)}>Mechanics</a>
            <a href="#autolearn" onClick={() => setMenu(false)}>AutoLearn</a>
            <a href="#workflow" onClick={() => setMenu(false)}>How it works</a>
            <a href="#pricing" onClick={() => setMenu(false)}>Pricing</a>
            <button className="mobile-menu-login" onClick={() => { setMenu(false); setAuthMode('login') }}>Log in</button>
          </div>
          <div className="navright">
            <button className="nav-login" onClick={() => setAuthMode('login')}>Log in</button>
            <button className="button mini nav-beta" onClick={() => setAuthMode('signup')}>Join beta →</button>
            <button className="menu-button" aria-label={menu ? 'Close navigation' : 'Open navigation'} onClick={() => setMenu(!menu)}>{menu ? '×' : '☰'}</button>
          </div>
        </nav>

        {result && (
          <section className={'auth ' + result.type}>
            <div>
              <b>ACCOUNT STATUS</b>
              <h2>{result.type === 'success' ? 'Email confirmed' : 'That link did not work'}</h2>
              <p>{result.message}</p>
            </div>
            <button onClick={() => { history.replaceState(null, '', '/'); setResult(null) }}>Dismiss</button>
          </section>
        )}

        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="pill">●　PERFORMANCE INTELLIGENCE FOR ROCKET LEAGUE</p>
            <h1>Every input.<br /><em>Made intentional.</em></h1>
            <p className="lede">MechLab measures the rep, explains what went wrong, gives you one correction to test next, and learns from whether that correction actually worked.</p>
            <div className="actions">
              <button className="button" onClick={() => setAuthMode('signup')}>Join the beta　→</button>
              <a href="#product">◉　See it in action</a>
            </div>
            <p className="trust"><span>DH</span><span>RL</span><span>GC</span><b>Built around evidence, not guesswork<small>Personal learning is local · Shared training is opt-in</small></b></p>
          </div>
          <Dashboard />
        </section>

        <section className="stats">
          <p>MEASURE WHAT MATTERS</p>
          <div>
            <span><b>120</b> HZ INPUT CAPTURE</span>
            <span><b>5</b> MECHANICS SCORED</span>
            <span><b>2</b> AUTOLEARN LOOPS</span>
            <span><b>1</b> CORRECTION AT A TIME</span>
          </div>
        </section>

        <section className="section" id="product">
          <Heading n="01" tag="LIVE TELEMETRY" title={<>See the mechanic.<br /><em>Not just the outcome.</em></>} text="MechLab captures every movement at 120 Hz, revealing the split-second inputs that separate almost from automatic." />
          <div className="telemetry reveal">
            <div className="panel controller-card">
              <label>CONTROLLER INPUT <b>● LIVE</b></label>
              <div className="controller"><i /><i /><span>+</span><b>Y　 B<br /> X　 A</b><em>MECH<br /><strong>LAB</strong></em></div>
              <div className="inputs">PITCH <i><b /></i>0.78　 YAW <i><b /></i>0.42</div>
            </div>
            <div className="panel timeline">
              <label>INPUT TIMELINE <b>FAST AERIAL · REP 12</b></label>
              <div className="events"><span>JUMP</span><span>PITCH</span><span>JUMP</span><span>BOOST</span></div>
              <Chart lime />
              <div className="callout">✦ <p><b>2ND JUMP: 43MS EARLIER</b>Example of the timing feedback MechLab produces.</p><strong>PREVIEW</strong></div>
            </div>
          </div>
        </section>

        <section className="section mechanics" id="mechanics">
          <Heading center n="02" tag="MECHANIC SCORING" title={<>Turn “felt good” into<br /><em>a score you can improve.</em></>} text="Every attempt is broken down across timing, precision, speed, and consistency—then translated into one clear score. Example scores below are product-preview data." />
          <div className="cards">
            {mechanics.map((m, i) => (
              <article className="reveal" style={{ '--d': i + '00ms' }} key={m[0]}>
                <header><span>PREVIEW 0{i + 1}</span><div className="score"><b>{m[2]}</b></div></header>
                <h3>{m[0]}</h3><p>{m[1]}</p><div className="bars"><i /><i /><i /><i /><i /></div>
                <a href="#insights">Explore scoring　→</a>
              </article>
            ))}
          </div>
        </section>

        <section className="section insights" id="insights">
          <div className="copy reveal">
            <Heading n="03" tag="CORRECTIVE COACHING" title={<>Feedback that ends with<br /><em>what to do next.</em></>} text="A score is not coaching. MechLab turns measured evidence into a problem statement, one next-rep change, a controlled practice drill, and the evidence level behind that advice." />
            <ul>
              {[
                ['✦', 'What happened', 'MechLab names the weakest measured pattern instead of saying “be more consistent.”'],
                ['→', 'What to change', 'The next rep gets one concrete timing, stick, or setup adjustment to test.'],
                ['⌁', 'How to practice it', 'A drill keeps the other variables steady so the correction can be measured.'],
                ['◎', 'How sure are we?', 'Observed patterns, model hypotheses, and validated interventions are labeled differently.'],
              ].map((x) => <li key={x[1]}><i>{x[0]}</i><b>{x[1]}<small>{x[2]}</small></b></li>)}
            </ul>
          </div>
          <div className="insightcard reveal">
            <header><span>✦ PRODUCT PREVIEW</span><b>EXAMPLE</b></header>
            <h3>What happened: your second jump is consistently late.</h3>
            <p><b>Next rep:</b> move the jump gap from 184 ms toward 122 ms while keeping the rest of the setup steady.</p>
            <p><b>Practice:</b> alternate deliberately early, normal, and late second jumps so MechLab can verify which change improves the physical outcome.</p>
            <div className="compare"><span>EXAMPLE AVERAGE<b>184<small>ms</small></b></span>→<span>EXAMPLE TARGET<b>122<small>ms</small></b></span></div>
            <button>Preview supporting reps　↗</button>
          </div>
        </section>

        <section className="section workflow autolearn" id="autolearn">
          <Heading center n="04" tag="AUTOLEARN" title={<>Starts with your reps.<br /><em>Grows into a shared model.</em></>} text="MechLab separates personal learning from shared learning so the app can improve immediately without pretending one player's data represents every player." />
          <div className="steps">
            {[
              ['Personal model', 'Your own measured sessions train a private model locally. No research-data opt-in is required for personal learning.'],
              ['Founder bootstrap', 'With training contribution enabled, the first shared model can start from 40 usable founder reps across 4 separate sessions, validated by holding out whole sessions.'],
              ['Evidence gate', 'Every six hours AutoLearn checks new consented evidence. Weak candidates and regressions are rejected automatically instead of replacing the last good model.'],
              ['Broader model', 'At 80 usable samples, 3 contributors, and 8 sessions, validation switches to held-out players so the bootstrap model can be replaced by evidence that generalizes better.'],
            ].map((s, i) => (
              <article className="reveal" key={s[0]}>
                <span>0{i + 1}</span><i>{['⌁', '◎', '✓', '↗'][i]}</i><h3>{s[0]}</h3><p>{s[1]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section analytics">
          <Heading n="05" tag="PROGRESS ANALYTICS · PRODUCT PREVIEW" title={<>Your progress,<br /><em>made visible.</em></>} text="The signed-in dashboard uses your synced Supabase session and mechanic data. The chart below is illustrative preview data." />
          <div className="analyticsbox reveal">
            <header>PRODUCT PREVIEW　 OVERVIEW　　MECHANICS　　SESSIONS <b>EXAMPLE RANGE</b></header>
            <label>EXAMPLE PERFORMANCE TREND</label><strong>+14.2% <small>illustrative</small></strong><Chart />
            <div className="scorerow">
              {mechanics.map((m) => <div key={m[0]}><span>{m[0]} <b>EXAMPLE</b></span><strong>{m[2]}<small>/100</small></strong><i><b style={{ width: m[2] + '%' }} /></i></div>)}
            </div>
          </div>
        </section>

        <section className="section workflow" id="workflow">
          <Heading center n="06" tag="THE TRAINING LOOP" title={<>Practice smarter.<br /><em>Improve on purpose.</em></>} />
          <div className="steps">
            {[
              ['Connect', 'Plug in your controller and launch Rocket League. Nothing to configure.'],
              ['Play', 'Train in freeplay or offline. MechLab detects every attempt.'],
              ['Understand', 'See what happened, why it matters, and the one correction to test next.'],
              ['Improve', 'Apply the change. MechLab measures whether the outcome actually got better.'],
            ].map((s, i) => <article className="reveal" key={s[0]}><span>0{i + 1}</span><i>{['⌁', '▶', '◎', '↗'][i]}</i><h3>{s[0]}</h3><p>{s[1]}</p></article>)}
          </div>
          <div className="reveal install-wizard-marketing"><InstallWizard approved={false} onDownload={() => setAuthMode('signup')} compact ctaLabel="Preview install flow" /></div>
        </section>

        <section className="section profile">
          <div className="profilebox reveal">
            <div className="player">
              <header><span>DH</span><b>EXAMPLE PLAYER<small>PRODUCT PREVIEW</small></b></header>
              <label>PREVIEW PROGRESSION</label><i className="progress" />
              <div className="playerstats"><b>1,248<small>EXAMPLE REPS</small></b><b>89<small>EXAMPLE SCORE</small></b><b>16<small>EXAMPLE STREAK</small></b></div>
              <div className="heatmap">{Array.from({ length: 72 }, (_, i) => <i className={i % 7 < 3 && i % 4 ? 'hot' : ''} key={i} />)}</div>
            </div>
            <div>
              <Heading tag="PRODUCT PREVIEW" title={<>A future home for<br /><em>your training history.</em></>} text="This progression card is a concept preview, not a promise that levels, streaks, badges, or milestones are already in the beta. The live account dashboard currently focuses on synced sessions and mechanic progress." />
              <div className="badges"><span>◇<b>EXAMPLE BADGE</b></span><span>↗<b>PREVIEW</b></span><span>✦<b>CONCEPT</b></span></div>
            </div>
          </div>
        </section>

        <section className="section pricing" id="pricing">
          <div className="reveal">
            <Heading center tag="START YOUR NEXT REP" title={<>Your mechanics aren’t random.<br /><em>Your training shouldn’t be either.</em></>} text="Start measuring what matters. Create your beta account and help turn the founder bootstrap into a broader evidence-backed model." />
            <button className="button" onClick={() => setAuthMode('signup')}>Create beta account　→</button>
            <small>FREE DURING BETA · WINDOWS 10/11 · NO CREDIT CARD</small>
            <small>PERSONAL AUTOLEARN RUNS LOCALLY · SHARED MODEL CONTRIBUTION IS OPTIONAL AND REQUIRES EXPLICIT CONSENT</small>
            <small>BETA 1 IS NOT CODE-SIGNED, SO WINDOWS MAY WARN ON FIRST RUN · FREEPLAY AND OFFLINE TRAINING ARE THE SUPPORTED WORKFLOWS · FLIP-RESET SCORING NEEDS THE OPTIONAL BAKKESMOD TELEMETRY PLUGIN</small>
            <small>SCORING THRESHOLDS ARE PROVISIONAL DURING BETA — HOW YOUR SCORES MOVE BETWEEN SESSIONS IS EXACT, THE ABSOLUTE FIGURES WILL SHIFT AS THEY ARE TUNED TO REAL REPS</small>
          </div>
        </section>

        <footer className="sitefooter">
          <div><Logo /><p>Performance intelligence for Rocket League players.</p></div>
          <div><b>PRODUCT</b><a href="#product">Live telemetry</a><a href="#mechanics">Scoring</a><a href="#insights">Corrective coaching</a><a href="#autolearn">AutoLearn</a></div>
          <div><b>BETA</b><button onClick={() => setAuthMode('signup')}>Request access</button><button onClick={() => setAuthMode('login')}>Tester sign in</button><a href="mailto:support@mechlab.gg">Support</a><a href="/privacy">Privacy</a><a href="/terms">Beta terms</a></div>
          <p className="copyright">© 2026 MECHLAB　 ·　 Not affiliated with Psyonix or Epic Games.　 ·　 <b>● SYSTEMS OPERATIONAL</b></p>
        </footer>
      </main>
      {authMode && <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)} />}
    </>
  )
}

export default App
