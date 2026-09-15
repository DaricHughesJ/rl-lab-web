import LabChrome from './LabChrome'
import { shipped, underTest, queued, horizons } from '../lib/labQueue'

export default function RoadmapPage() {
  return (
    <LabChrome active="roadmap">
      <header className="lab-hero">
        <p className="v2-specimen">PUBLIC ROADMAP · ALPHA</p>
        <h1>Roadmap.<br /><em>What we are building next.</em></h1>
        <p className="lab-lede">
          This is the working list for MechLab, not a promise calendar. Items move when the product proves out.
        </p>
        <p className="lab-updated">Last updated · 15 Sep 2026</p>
      </header>

      <section className="v2-section lab-queue">
        <div className="v2-heading">
          <p>01 / STATUS</p>
          <h2>Shipping, under test, not done yet.</h2>
          <span>Same buckets as the home page. Unfinished work stays labeled unfinished.</span>
        </div>

        <div className="v2-status-block live">
          <header>
            <span>●</span>
            <div>
              <b>SHIPPING NOW</b>
              <small>in the desktop app</small>
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
                <small>do not treat as finished</small>
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
                <b>NOT DONE YET</b>
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
          <p>02 / PHASES</p>
          <h2>Order of work.</h2>
          <span>We harden the first three mechanics before we add a big library of drills.</span>
        </div>
        <div className="lab-horizon-grid">
          {horizons.map((h) => (
            <article className="lab-horizon" key={h.id}>
              <p>PHASE {h.id}</p>
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
          <p>ALPHA</p>
          <h2>Help us reorder this list.</h2>
          <span>If something queued is blocking you more than something under test, tell us. Send the broken sessions.</span>
        </div>
        <a className="v2-button primary" href="/signup">Request access <span>→</span></a>
      </section>
    </LabChrome>
  )
}
