import LabChrome from './LabChrome'
import { withUtms } from '../lib/utm'

export default function PricingPage() {
  const early = withUtms('/waitlist')
  return (
    <LabChrome active="pricing">
      <header className="lab-hero">
        <p className="v2-specimen">PRICING · ALPHA</p>
        <h1>One beta plan.<br /><em>Built for the practice loop.</em></h1>
        <p className="lab-lede">
          Planned beta price: $5.99 per month. Checkout is not open yet, and requesting access will not charge you.
        </p>
      </header>

      <section className="v2-section dbg-plans">
        <article className="dbg-plan featured beta-plan">
          <p>MECHLAB BETA</p>
          <h2>$5.99 <small>/ month</small></h2>
          <span>Planned beta subscription. The full feature set and billing terms will be shown before checkout opens.</span>
          <ul><li>Windows desktop app with all 15 measured mechanics</li><li>Live coaching, overlay, Replay Coach and corrected-input simulations</li><li>Cancel terms shown clearly before you pay</li></ul>
          <a className="v2-button primary" href={early}>Request beta access <span>→</span></a>
        </article>
        <p className="lab-lede beta-note">No payment is collected by this page. $5.99/month is the planned beta price, not an active offer.</p>
      </section>

      <section className="v2-cta lab-cta">
        <div>
          <p>ALPHA</p>
          <h2>Know what you’re signing up for.</h2>
          <span>Read how the app works and what its current limits are before requesting access.</span>
        </div>
        <a className="v2-button primary" href="/docs">Read the guide <span>→</span></a>
      </section>
    </LabChrome>
  )
}
