import LabChrome from './LabChrome'
const faqs = [
  {
    q: 'Does this work online or in ranked?',
    a: 'MechLab is a Windows desktop app. Its current workflow and requirements are documented in the setup guide. It is not a console app.',
  },
  {
    q: 'Is this an AI coach?',
    a: 'MechLab turns each practice attempt into a session you can review. It brings your live cue, controller inputs, and game-state context together so you can focus on the next rep.',
  },
  {
    q: 'What if a diagnosis is wrong?',
    a: 'MechLab is built to show you what happened in the rep and give you a clear place to start for the next one. If a result looks off, send the session context to support so we can help.',
  },
  {
    q: 'PC only?',
    a: 'Yes for alpha. Console is out of scope for now.',
  },
  {
    q: 'Which controllers are supported?',
    a: 'The app reads the controller and bindings available in your setup. Button names and layouts can differ; check the in-app controller check and setup guide if inputs appear wrong.',
  },
  { q: 'What does the stick heatmap show?', a: 'It shows where your recorded stick input spent time during a rep. Replay Coach keeps the heatmap with the controller inputs and the selected moment, so you can see the shape of your movement rather than a made-up controller picture.' },
  { q: 'What are corrected replays?', a: 'They let you try a bounded input change in simulation. MechLab starts from the original recorded controls, applies the selected correction window, then resumes the controls you actually recorded.' },
  { q: 'Can I change data sharing?', a: 'Yes. Account Settings → Data & Replays lets you control progress sync, usage analytics, and training-data contribution. MechLab shows the saved choices for your account.' },
  { q: 'Can I erase my account data?', a: 'MechLab includes account data controls for training-data erasure. The privacy page explains account and synced-data deletion requests; support can help if you need assistance.' },
  {
    q: 'When will billing start?',
    a: 'The planned beta price is $5.99 per month. Paid checkout is not open, and requesting access does not charge you. Billing and cancellation terms will be shown before you pay.',
  },
  { q: 'Does MechLab guarantee a rank-up?', a: 'No. It is a practice and review tool, not a promise of results. Improvement depends on practice and the quality of the available evidence.' },
  { q: 'What happens to my sessions?', a: 'Session storage and account handling are described in the privacy notice. Review the current terms and privacy page before using the alpha.' },
  { q: 'Can I use it during online matches?', a: 'MechLab is designed around training and review. Do not use it to gain an advantage in online matches; follow Rocket League rules and the app’s current setup guidance.' },
]

export default function FaqPage() {
  return (
    <LabChrome active="faq">
      <header className="lab-hero">
        <p className="v2-specimen">FAQ</p>
        <h1>Common questions.</h1>
        <p className="lab-lede">Straight answers on platform, accuracy, and what we refuse to claim.</p>
      </header>

      <section className="v2-section dbg-faq-list">
        {faqs.map((item) => (
          <article key={item.q}>
            <h2>{item.q}</h2>
            <p>{item.a}</p>
          </article>
        ))}
      </section>

      <section className="v2-cta lab-cta">
        <div>
          <p>STILL OPEN</p>
          <h2>Email support if your setup is weird.</h2>
          <span>support@mechlab.gg</span>
        </div>
        <a className="v2-button primary" href="/docs">Read setup guide <span>→</span></a>
      </section>
    </LabChrome>
  )
}
