import LabChrome from './LabChrome'

const chapters = [
  ['01', 'SETUP', 'Install and launch', 'Install the Windows beta and open MechLab. Home lists anything that still needs doing before your first rep; when it shows nothing, you’re set.'],
  ['02', 'SETUP', 'Connect your controller', 'Plug in the controller you play Rocket League with and confirm its buttons once. MechLab uses your binds for button names in every guide and replay.'],
  ['03', 'PRACTICE', 'Pick a mechanic', 'Open Practice and pick any of the 15 mechanics. Each one shows how the rep is done, where it usually goes wrong, and a clean rep you can watch.'],
  ['04', 'PRACTICE', 'Play a rep', 'Choose Start practice, then play the rep in Free Play or a training pack. The overlay shows your score and the one change to make next. A failed rep says Missed with coaching, not a number.'],
  ['05', 'REVIEW', 'Read your stick and buttons', 'In Replay Coach, scrub to the moment you want to understand. The controller view shows where your stick was and which buttons you pressed at that moment.'],
  ['06', 'REVIEW', 'Try a corrected replay', 'The simulator replays your rep with one small input change and shows where the car would have gone. It’s always labelled as a prediction; your recorded rep never changes.'],
  ['07', 'REVIEW', 'Take one fix into the next rep', 'Pick the single change the coach names, play the mechanic again, and compare. One fix at a time beats five at once.'],
  ['08', 'YOUR DATA', 'Choose what leaves your PC', 'In Settings → Data & Replays, choose whether to sync progress, send usage analytics and share reps. Account shows what’s waiting to upload and lets you erase your account data.'],
  ['09', 'YOUR DATA', 'Privacy and support', 'The privacy notice and terms say how your data is handled. For setup or score problems, email support@mechlab.gg with your app version and what you saw. Never send passwords.'],
]

export default function DocsPage() {
  return <LabChrome active="docs">
    <header className="lab-hero">
      <p className="v2-specimen">MECHLAB GUIDE · WINDOWS BETA</p>
      <h1>From launch<br /><em>to a useful next rep.</em></h1>
      <p className="lab-lede">Set up once, then pick, play, review and go again.</p>
    </header>
    <section className="v2-section guide-layout">
      <aside className="guide-toc" aria-label="Guide contents"><b>IN THIS GUIDE</b>{chapters.map(([n, , title]) => <a key={n} href={`#guide-${n}`}>{n} · {title}</a>)}<a href="/faq">Frequently asked questions</a></aside>
      <div className="guide-chapters">{chapters.map(([n, group, title, body]) => <article id={`guide-${n}`} key={n}><p className="v2-specimen">{n} / {group}</p><h2>{title}</h2><p>{body}</p></article>)}</div>
    </section>
    <section className="v2-cta lab-cta"><div><p>NEED HELP?</p><h2>Tell us what you ran into.</h2><span>Contact support@mechlab.gg with the app version and steps to reproduce.</span></div><a className="v2-button primary" href="mailto:support@mechlab.gg">Contact support <span>→</span></a></section>
  </LabChrome>
}
