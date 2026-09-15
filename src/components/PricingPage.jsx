import LabChrome from './LabChrome'
import { withUtms } from '../lib/utm'
import { track } from '../lib/waitlist'

const plans = [
  {
    name: 'Free',
    price: '$0',
    detail: '20 to 40 reps per week, 1 mechanic, local history',
  },
  {
    name: 'Pro',
    price: '$12/mo',
    detail: 'Unlimited reps, all live mechanics, full Replay Coach',
    featured: true,
  },
  {
    name: 'Founders',
    price: '$79 lifetime',
    detail: 'First 500 players, early price locked, private feedback channel',
  },
]

export default function PricingPage() {
  const early = withUtms('/waitlist')
  return (
    <LabChrome active="pricing">
      <header className="lab-hero">
        <p className="v2-specimen">PRICING · ALPHA</p>
        <h1>Start free.<br /><em>Pay when you need more.</em></h1>
        <p className="lab-lede">
          Price follows trusted diagnosis, not feature count. Free unlocks the loop. Pro unlocks volume.
        </p>
      </header>

      <section className="v2-section dbg-plans">
        <div className="dbg-plan-grid">
          {plans.map((p) => (
            <article className={`dbg-plan${p.featured ? ' featured' : ''}`} key={p.name}>
              <p>{p.name.toUpperCase()}</p>
              <h2>{p.price}</h2>
              <span>{p.detail}</span>
              <a
                className={`v2-button${p.featured ? ' primary' : ''}`}
                href={early}
                onClick={() => track('cta_click', { href: early, place: `pricing_${p.name}` })}
              >
                Get early access <span>→</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="v2-cta lab-cta">
        <div>
          <p>ALPHA</p>
          <h2>Founders opens with public alpha.</h2>
          <span>Join the waitlist first. We email when seats open.</span>
        </div>
        <a className="v2-button primary" href={early}>Join waitlist <span>→</span></a>
      </section>
    </LabChrome>
  )
}
