import LabChrome from './LabChrome'
import { withUtms } from '../lib/utm'

export default function PricingPage() {
  const early = withUtms('/waitlist')
  return (
    <LabChrome active="pricing">
      <header className="lab-hero">
        <p className="v2-specimen">PRICING · BETA</p>
        <h1>One beta plan.<br /><em>Built for the practice loop.</em></h1>
        <p className="lab-lede">
          $5.99 a month once checkout opens. Joining the beta now costs nothing.
        </p>
      </header>

      <section className="v2-section dbg-plans">
        <article className="dbg-plan featured beta-plan">
          <p>MECHLAB BETA</p>
          <h2>$5.99 <small>/ month</small></h2>
          <span>Planned price. Checkout isn’t open yet; you’ll see the full terms before you pay anything.</span>
          <ul><li>Windows desktop app with all 15 mechanics</li><li>Live coaching, the in-game overlay, Replay Coach and corrected replays</li><li>Cancel terms shown before you pay</li></ul>
          <a className="v2-button primary" href={early}>Join the beta <span>→</span></a>
        </article>
      </section>

      <section className="v2-cta lab-cta">
        <div>
          <p>BEFORE YOU JOIN</p>
          <h2>Know what you’re signing up for.</h2>
          <span>Read how the app works and what its current limits are before requesting access.</span>
        </div>
        <a className="v2-button primary" href="/docs">Read the guide <span>→</span></a>
      </section>
    </LabChrome>
  )
}
