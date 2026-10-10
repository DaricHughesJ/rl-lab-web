import LabChrome from './LabChrome'

const chapters = [
  ['01', 'Install and launch', 'Install the current Windows build, open MechLab, and resolve any system checks shown on Home before starting a session. The app’s status indicators are the source of truth for your setup.'],
  ['02', 'Connect your controller', 'Connect the controller you use for Rocket League, then check that MechLab sees the expected device and button layout. MechLab uses the detected controller for button labels and keybind-aware practice guides.'],
  ['03', 'Choose a training mechanic', 'Open Train and pick any of the 15 available mechanics. Each drill gives you a focused way to practice a movement, aerial play, reset, or shot.'],
  ['04', 'Run and review a rep', 'Start the training flow and follow the on-screen cue. After the attempt, inspect the inputs and game-state signals that were actually captured. Missing or uncertain evidence should remain visible as missing or uncertain.'],
  ['05', 'Read your stick heatmap', 'In Replay Coach, scrub to the part of the rep you want to understand. The controller view shows recorded stick movement and sample density alongside the selected moment and the detected controller layout.'],
  ['06', 'Try a corrected replay', 'Use a corrected replay to explore a small input change in simulation. It starts with your original recording, applies the bounded correction, then resumes your recorded controls. It is a way to explore an alternative, not a replacement for the original attempt.'],
  ['07', 'Choose your data settings', 'Open Settings → Data & Replays to choose progress sync, usage analytics, and training-data contribution. The account view shows confirmed choices, the upload queue gives you retry controls when an item needs attention, and the account data tools include erasure.'],
  ['08', 'Turn the review into a next rep', 'Look at the cue, controller inputs, and game events around the moment you want to improve. Choose one adjustment, run the mechanic again, and compare how the rep feels and looks.'],
  ['09', 'Privacy and support', 'Read the privacy notice and terms for current data handling. For setup or result issues, contact support@mechlab.gg and include the app version and a description of what you saw. Avoid sending account secrets.'],
]

export default function DocsPage() {
  return <LabChrome active="docs">
    <header className="lab-hero">
      <p className="v2-specimen">MECHLAB GUIDE · WINDOWS ALPHA</p>
      <h1>From launch<br /><em>to a useful next rep.</em></h1>
      <p className="lab-lede">A practical guide to setup, training, reading your evidence, and turning a review into the next rep.</p>
    </header>
    <section className="v2-section guide-layout">
      <aside className="guide-toc" aria-label="Guide contents"><b>IN THIS GUIDE</b>{chapters.map(([n, title]) => <a key={n} href={`#guide-${n}`}>{n} · {title}</a>)}<a href="/faq">Frequently asked questions</a></aside>
      <div className="guide-chapters">{chapters.map(([n, title, body]) => <article id={`guide-${n}`} key={n}><p className="v2-specimen">{n} / SETUP</p><h2>{title}</h2><p>{body}</p></article>)}</div>
    </section>
    <section className="v2-cta lab-cta"><div><p>NEED HELP?</p><h2>Tell us what you ran into.</h2><span>Contact support@mechlab.gg with the app version and steps to reproduce.</span></div><a className="v2-button primary" href="mailto:support@mechlab.gg">Contact support <span>→</span></a></section>
  </LabChrome>
}
