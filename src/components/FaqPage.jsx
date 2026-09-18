import LabChrome from './LabChrome'
import { withUtms } from '../lib/utm'

const faqs = [
  {
    q: 'Does this work online or in ranked?',
    a: 'No. Supported mode is Windows training with EAC off.',
  },
  {
    q: 'Is this an AI coach?',
    a: 'No. MechLab measures each attempt and shows the evidence. It is not a generic tip feed.',
  },
  {
    q: 'What if a diagnosis is wrong?',
    a: 'If we are unsure, we say so. Tell us when a number is wrong.',
  },
  {
    q: 'PC only?',
    a: 'Yes for alpha. Console is out of scope for now.',
  },
  {
    q: 'Do I need BakkesMod?',
    a: 'Capture depends on the current Windows training path. Setup is documented in the app. Platform support can change after Rocket League patches.',
  },
  {
    q: 'Refunds?',
    a: 'Founders and Pro terms will be clear before paid checkout. Alpha waitlist does not charge you.',
  },
]

export default function FaqPage() {
  const early = withUtms('/waitlist')
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
        <a className="v2-button primary" href={early}>Join waitlist <span>→</span></a>
      </section>
    </LabChrome>
  )
}
