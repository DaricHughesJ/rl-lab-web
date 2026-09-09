import './DevelopmentRoadmap.css'

const products = [
  {
    name: 'Desktop',
    status: 'BETA',
    tone: 'live',
    headline: 'The measurement engine',
    body: 'Windows remains the core capture and scoring surface: controller input, screen context, mechanic detection, scoring, coaching evidence, and optional BakkesMod telemetry all originate here.',
    detail: '120 Hz controller capture · local analysis · synced progress',
  },
  {
    name: 'iPhone',
    status: 'PRIVATE BUILD',
    tone: 'private',
    headline: 'Native companion is running',
    body: 'The Flutter iOS companion now signs in with the same MechLab account and reads live sessions, mechanic progress, coach focus, profile state, and privacy controls from Supabase Realtime.',
    detail: 'Cloud macOS build validated · unsigned IPA packaged successfully',
  },
  {
    name: 'Android',
    status: 'NEXT',
    tone: 'next',
    headline: 'Same companion, next package',
    body: 'The Flutter source already targets Android. Release packaging, device QA, and a clean tester install path are the next steps before an Android beta is called available.',
    detail: 'Source-ready · public package not released yet',
  },
  {
    name: 'Web',
    status: 'LIVE',
    tone: 'live',
    headline: 'Account and product home',
    body: 'The website handles beta access, account sign-in, synced progress views, release information, product education, privacy controls, and the public development story.',
    detail: 'Supabase-backed · desktop beta delivery',
  },
]

const roadmap = [
  {
    phase: 'NOW',
    title: 'Make the companion useful every day',
    status: 'IN TESTING',
    items: [
      'Validate the iPhone build on real devices and tighten navigation, spacing, loading, and empty states.',
      'Keep session history and mechanic progress live through Supabase Realtime.',
      'Turn coach focus into a fast “what should I work on next?” surface instead of a second analytics dashboard.',
      'Keep capture and scoring on desktop so the phone stays lightweight and never pretends to replace telemetry collection.',
    ],
  },
  {
    phase: 'NEXT',
    title: 'Package the mobile beta',
    status: 'BUILDING',
    items: [
      'Produce a repeatable Android release artifact and test it across common devices.',
      'Move iOS from founder-device sideloading toward a normal signed beta distribution path when Apple distribution is ready.',
      'Add release/version visibility so testers know which desktop and mobile builds are paired.',
      'Add notification foundations for completed syncs, new personal bests, and genuinely useful coaching events—not notification spam.',
    ],
  },
  {
    phase: 'AFTER',
    title: 'Connect practice to measurable outcomes',
    status: 'PLANNED',
    items: [
      'Build guided drills around one measurable correction at a time.',
      'Show before/after evidence for coaching interventions so advice can be validated instead of merely generated.',
      'Expand supported mechanics and calibrate scoring against broader real-player data.',
      'Use longitudinal history to separate a one-session hot streak from a mechanic that has actually become more reliable.',
    ],
  },
  {
    phase: 'LATER',
    title: 'Broaden the learning system',
    status: 'DIRECTION',
    items: [
      'Graduate AutoLearn from founder bootstrap data into held-out-player validation as contributor and session gates are met.',
      'Build challenge and progression systems only where they reinforce deliberate practice rather than arbitrary engagement.',
      'Expose stable developer-facing data interfaces when the scoring contracts are mature enough to support an SDK without constant breakage.',
      'Keep privacy boundaries explicit: personal learning can remain local; shared training contribution stays opt-in.',
    ],
  },
]

const log = [
  {
    date: 'AUG 31, 2026',
    title: 'The mobile companion became a real iPhone build',
    body: 'MechLab’s Flutter companion was merged into the core project with account authentication, live overview, mechanic cards, session history, coach focus, profile controls, and Realtime updates. A GitHub-hosted macOS runner then compiled the actual iOS app, packaged an unsigned IPA, and passed the mobile analyzer. Founder-device installation is currently handled through private signing/sideloading rather than TestFlight or the App Store.',
  },
  {
    date: 'AUG 30, 2026',
    title: 'AutoLearn moved from idea to gated training loop',
    body: 'The shared learning path now has explicit evidence gates instead of “train whenever data exists.” Founder bootstrap can begin from one opted-in contributor only after enough usable reps exist across separate sessions, while the broader stage requires multiple contributors and held-out-player validation.',
  },
  {
    date: 'AUG 28, 2026',
    title: 'Release metadata became part of the product',
    body: 'The web stack gained a public update manifest and a clearer beta install flow. That work is the foundation for eventually presenting desktop and mobile versions as one coordinated MechLab ecosystem instead of unrelated downloads.',
  },
]

function StatusChip({ tone, children }) {
  return <span className={`dev-status-chip ${tone}`}>{children}</span>
}

function DevelopmentRoadmap({ onJoin }) {
  return (
    <>
      <section className="section dev-ecosystem" id="mobile">
        <div className="dev-section-head reveal show">
          <p className="dev-kicker"><b>07</b> MECHLAB ECOSYSTEM</p>
          <h2>Desktop measures it.<br /><em>Mobile keeps it with you.</em></h2>
          <p>
            MechLab is becoming a connected training system rather than a single Windows screen. The desktop app remains the measurement engine; web and mobile turn that evidence into history, focus, and coaching you can review away from Rocket League.
          </p>
        </div>

        <div className="dev-product-grid">
          {products.map((product) => (
            <article className="dev-product reveal show" key={product.name}>
              <header>
                <span>{product.name}</span>
                <StatusChip tone={product.tone}>{product.status}</StatusChip>
              </header>
              <h3>{product.headline}</h3>
              <p>{product.body}</p>
              <small>{product.detail}</small>
            </article>
          ))}
        </div>

        <div className="dev-mobile-detail reveal show">
          <div>
            <p className="dev-label">IPHONE STATUS · PRIVATE DEVICE TESTING</p>
            <h3>The app exists now. Distribution is the unfinished part.</h3>
            <p>
              The current iOS build is a native Flutter app compiled on a GitHub macOS runner. It has successfully produced an unsigned IPA for private device signing. Founder testing can use a signing service such as Signulous; this is not the same as an App Store or TestFlight release, and the public site will not label iOS “available” until there is a repeatable tester distribution path.
            </p>
          </div>
          <div className="dev-phone" aria-label="MechLab mobile companion preview">
            <div className="dev-phone-top"><i /><span>MECHLAB</span><b>SYNCED</b></div>
            <div className="dev-phone-score"><small>CURRENT FORM</small><strong>88</strong><span>FAST AERIAL</span></div>
            <div className="dev-phone-metrics"><span><b>14</b>SESSIONS</span><span><b>286</b>REPS</span><span><b>5</b>TRACKED</span></div>
            <div className="dev-phone-focus"><small>COACH FOCUS</small><b>Second-jump timing</b><p>Keep the setup steady and release sooner on the next rep.</p></div>
            <footer><span>Overview</span><span>Mechanics</span><span>Sessions</span><span>Profile</span></footer>
          </div>
        </div>
      </section>

      <section className="section dev-roadmap" id="roadmap">
        <div className="dev-section-head center reveal show">
          <p className="dev-kicker"><b>08</b> DEVELOPMENT ROADMAP</p>
          <h2>What is shipped.<br /><em>What comes next.</em></h2>
          <p>This roadmap is intentionally status-based. “Planned” means direction, not a promised ship date.</p>
        </div>

        <div className="dev-roadmap-grid">
          {roadmap.map((group) => (
            <article className="dev-roadmap-card reveal show" key={group.phase}>
              <header><span>{group.phase}</span><b>{group.status}</b></header>
              <h3>{group.title}</h3>
              <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section dev-log" id="devlog">
        <div className="dev-section-head reveal show">
          <p className="dev-kicker"><b>09</b> DEVELOPMENT LOG</p>
          <h2>Building in public.<br /><em>Without pretending it is finished.</em></h2>
          <p>The useful version of a dev blog is a record of what changed, what was proven, and what still has to work before a feature earns an “available” badge.</p>
        </div>

        <div className="dev-log-list">
          {log.map((entry) => (
            <article className="dev-log-entry reveal show" key={entry.date}>
              <time>{entry.date}</time>
              <div><h3>{entry.title}</h3><p>{entry.body}</p></div>
            </article>
          ))}
        </div>

        <div className="dev-principles reveal show">
          <div><small>PRODUCT RULE</small><b>Measure first.</b><p>No coaching claim should outrun the evidence behind it.</p></div>
          <div><small>MOBILE RULE</small><b>Companion, not fake capture.</b><p>The phone reviews synced evidence; desktop still performs game-side measurement.</p></div>
          <div><small>MODEL RULE</small><b>Opt-in shared learning.</b><p>Personal improvement and research contribution remain separate choices.</p></div>
          <div><small>RELEASE RULE</small><b>Status means something.</b><p>Private build, beta, and public release are labeled differently.</p></div>
        </div>

        <div className="dev-cta reveal show">
          <div><small>CURRENT BETA</small><h3>Desktop is the entry point today.</h3><p>Join the beta for the current Windows training flow. Mobile access will widen as device testing and distribution mature.</p></div>
          <button className="button" onClick={onJoin}>Join the beta →</button>
        </div>
      </section>
    </>
  )
}

export default DevelopmentRoadmap
