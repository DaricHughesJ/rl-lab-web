import { useEffect, useState } from 'react'
import './App.css'

const mechanics = [['Fast aerials','Jump timing, pitch depth, and boost coverage'],['Speed flips','Dodge angle, cancel speed, and air-roll timing'],['Half flips','Cancel precision and recovery consistency']]

function authResult() {
  const hash = new URLSearchParams(window.location.hash.slice(1))
  const query = new URLSearchParams(window.location.search)
  const error = hash.get('error_description') || query.get('error_description')
  if (error) return { type: 'error', message: error.replaceAll('+', ' ') }
  if (hash.get('access_token') || query.get('code')) return { type: 'success', message: 'Your email is confirmed. You can return to RL Lab and sign in.' }
  return null
}

function App() {
  const [result, setResult] = useState(null)
  useEffect(() => setResult(authResult()), [])
  return <main>
    <nav><a className="brand" href="#top"><span>RL</span> LAB</a><div className="nav-links"><a href="#how">How it works</a><a href="#mechanics">Mechanics</a><a className="nav-cta" href="https://github.com/DaricHughesJ/rl-lab">GitHub</a></div></nav>
    {result && <section className={`auth-result ${result.type}`} role="status"><div><p className="eyebrow">ACCOUNT STATUS</p><h2>{result.type === 'success' ? 'Email confirmed' : 'That link did not work'}</h2><p>{result.message}</p></div><button onClick={() => { history.replaceState(null, '', '/'); setResult(null) }}>Dismiss</button></section>}
    <section className="hero" id="top"><div className="hero-copy"><p className="eyebrow">ROCKET LEAGUE · MECHANICS COACHING</p><h1>Stop guessing.<br/><em>See the input.</em></h1><p className="lede">RL Lab turns controller timing and game telemetry into clear, measurable coaching—so every repetition teaches you something.</p><div className="actions"><a className="primary" href="https://github.com/DaricHughesJ/rl-lab/releases">Get RL Lab</a><a className="secondary" href="#how">See how it works</a></div><p className="privacy">Local-first capture. Your raw sessions stay yours.</p></div>
      <div className="score-panel"><div className="panel-head"><span>LAST SESSION</span><span>12:42</span></div><div className="score"><strong>87</strong><span>/100</span></div>{[['Fast aerial','91%'],['Speed flip','84%'],['Half flip','79%']].map(([name,value])=><div key={name}><div className="metric"><span>{name}</span><b>{value}</b></div><div className="bar"><i style={{width:value}}/></div></div>)}<p className="coach-note"><span>WORK ON NEXT</span>Release the stick sooner on your second jump.</p></div></section>
    <section className="proof"><span>120 Hz controller capture</span><span>Physics-aware telemetry</span><span>Measured progress over time</span></section>
    <section className="how" id="how"><div><p className="eyebrow">THE FEEDBACK LOOP</p><h2>Practice with evidence.</h2></div><ol><li><b>01</b><h3>Play naturally</h3><p>Record freeplay while RL Lab reads your controller and optional game telemetry.</p></li><li><b>02</b><h3>See every rep</h3><p>Attempts are detected and scored on timing, precision, and consistency.</p></li><li><b>03</b><h3>Correct one thing</h3><p>Get a specific adjustment backed by the inputs that produced your result.</p></li></ol></section>
    <section className="mechanics" id="mechanics"><p className="eyebrow">BUILT FOR THE DETAILS</p><h2>Mechanics become measurements.</h2><div className="mechanic-grid">{mechanics.map(([name,detail],i)=><article key={name}><span>0{i+1}</span><h3>{name}</h3><p>{detail}</p></article>)}</div></section>
    <section className="closing"><p className="eyebrow">CLOSED BETA</p><h2>Your next rep should know<br/>what the last one taught you.</h2><a className="primary" href="https://github.com/DaricHughesJ/rl-lab">View the project</a></section>
    <footer><a className="brand" href="#top"><span>RL</span> LAB</a><p>Rocket League mechanics coaching from raw controller input.</p><small>Not affiliated with Psyonix or Epic Games.</small></footer>
  </main>
}
export default App
