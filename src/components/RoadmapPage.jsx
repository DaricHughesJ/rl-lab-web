import LabChrome from './LabChrome'
import { shipped, underTest, queued, horizons } from '../lib/labQueue'

export default function RoadmapPage() {
  return (
    <LabChrome active="roadmap">
      <header className="lab-hero">
        <p className="v2-specimen">PUBLIC QUEUE · ALPHA</p>
        <h1>Roadmap.<br /><em>What’s on the rack.</em></h1>
        <p className="lab-lede">
          Working queue for MechLab—not a promise calendar. Things move when the loop proves out, not when a slide says they should.
        </p>
        <p className="lab-updated">Last updated · 12 Sep 2026</p>
      </header>

      <section className="v2-section lab-queue">
        <div className="v2-heading">
          <p>01 / STATE</p>
          <h2>Shipped, under test, queued.</h2>
          <span>Same buckets as the home Lab notes. Unfinished work stays labeled unfinished.</span>
        </div>

        <div className="v2-status-block live">
          <header>
            <span>●</span>
            <div>
              <b>ON THE BENCH NOW</b>
              <small>shipping in the desktop UI</small>
            </div>
          </header>
          <div className="v2-status-grid">
            {shipped.map(([title, text]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="v2-status-split">
          <div className="v2-status-block validation">
            <header>
              <span>◆</span>
              <div>
                <b>BUILT · UNDER TEST</b>
                <small>don’t treat as finished</small>
              </div>
            </header>
            {underTest.map(([title, text]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <div className="v2-status-block next">
            <header>
              <span>○</span>
              <div>
                <b>QUEUE · NOT DONE</b>
                <small>planned or incomplete</small>
              </div>
            </header>
            {queued.map(([title, text]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="v2-section">
        <div className="v2-heading">
          <p>02 / HORIZONS</p>
          <h2>Order of attack.</h2>
          <span>H1 before H2 before H3. We widen the mechanic rack only after the first three protocols hold up.</span>
        </div>
        <div className="lab-horizon-grid">
          {horizons.map((h) => (
            <article className="lab-horizon" key={h.id}>
              <p>{h.id}</p>
              <h3>{h.title}</h3>
              <span>{h.summary}</span>
              <ul>
                {h.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="v2-cta lab-cta">
        <div>
          <p>ALPHA COHORT</p>
          <h2>Help us reorder this list.</h2>
          <span>Broken sessions beat opinions. If a queued item is blocking you harder than something under test, say so.</span>
        </div>
        <a className="v2-button primary" href="/signup">Request access <span>→</span></a>
      </section>
    </LabChrome>
  )
}
