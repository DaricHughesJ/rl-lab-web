import LabChrome from './LabChrome'

const plans = [
  {
    number: '01',
    title: 'Go deeper on advanced mechanics',
    intro: 'Make complex aerial plays as inspectable as a single clean rep.',
    ideas: [
      'Air Dribble phases from wall exit and ground pop through repeated touches',
      'Flip Reset acquisition, contact, and follow-up control in one readable sequence',
      'Compound Air Dribble → Reset plays with each touch preserved on the timeline',
      'Multiple resets and chained touches without losing the story of the play',
      'Ceiling shots and ceiling resets, with the setup and recovery kept in view',
      'Musty Flick, Pop Reset, Double Tap, Stall, Zap Dash and Chain Dash breakdowns',
    ],
  },
  {
    number: '02',
    title: 'Turn Replay Coach into your film room',
    intro: 'Move from “that felt off” to a replay you can read, compare, and learn from.',
    ideas: [
      'Compare two attempts on one synchronized timeline',
      'Layer controller inputs, stick heatmaps, game events, notes, and replay frames',
      'Explore a clearer 3D car-and-ball path when the recording contains the right data',
      'Mark key frames, add notes, and return to the exact moment later',
      'Measure each meaningful contact in compound plays instead of collapsing it into one score',
      'Export a focused session report to share with a coach or training partner',
    ],
  },
  {
    number: '03',
    title: 'Make coaching personal to your reps',
    intro: 'Build on what you do well and give the next attempt one clear job.',
    ideas: [
      'Personal reference ranges learned from your own clean, repeatable attempts',
      'A root-cause view that ranks the differences most relevant to a miss',
      'Practice plans aimed at the timing or control window you want to improve',
      'A weekly training recap with mechanics practiced, patterns, and next steps',
      'Track which cues help players change their next rep over time',
      'Keep feedback specific to what the recording shows, with the supporting moment close by',
    ],
  },
  {
    number: '04',
    title: 'Give every controller a natural home',
    intro: 'Make the input view feel familiar from the first session.',
    ideas: [
      'Richer Xbox and PlayStation layouts around today’s stick-first replay view',
      'Readable stick paths and density maps for left and right stick movement',
      'Calibration and binding context beside each replay',
      'Clearer input-health and capture-status details when a signal drops',
    ],
  },
  {
    number: '05',
    title: 'Make progress easy to see and keep',
    intro: 'Turn a folder of attempts into a record of how your game is changing.',
    ideas: [
      'A searchable local session library with fast reopen',
      'Mechanic-by-mechanic consistency and personal best trends',
      'Optional cloud sync and recovery across devices',
      'Private share links for selected reports, with raw capture kept protected',
      'Coach and player workflows for reviewing the same evidence together',
      'A mobile companion for checking progress and session summaries',
    ],
  },
  {
    number: '06',
    title: 'Understand the physics behind the play',
    intro: 'Keep adding useful context where the recording supports it.',
    ideas: [
      'Car-to-ball contact geometry, relative motion, and ball spin',
      'Wheel, throttle, brake, and surface interaction in recoveries and dashes',
      'Hitbox-specific context for reads and touches',
      'More mechanic-specific simulation scenarios beyond bounded input corrections',
      'Broader mechanic coverage shaped by the way players actually train',
    ],
  },
]

export default function RoadmapPage() {
  return <LabChrome active="roadmap">
    <header className="lab-hero roadmap-hero">
      <p className="v2-specimen">WHAT’S AHEAD · MECHLAB</p>
      <h1>More than a score.<br /><em>A better way to train.</em></h1>
      <p className="lab-lede">The 15-mechanic training library is ready today. Here’s the bigger MechLab we’re building around it: deeper play breakdowns, coaching that learns your patterns, and progress you can take anywhere.</p>
      <a className="v2-button primary roadmap-hero-cta" href="/#mechanics">Explore the mechanics <span>→</span></a>
    </header>
    <section className="v2-section roadmap-plans">
      <div className="v2-heading"><p>THE NEXT CHAPTERS</p><h2>Ideas with room to grow.</h2><span>From advanced mechanic analysis to a personal training history, each direction adds another useful layer to your practice.</span></div>
      <div className="roadmap-grid">{plans.map((plan) => <article className="roadmap-card" key={plan.number}>
        <p className="roadmap-number">{plan.number} <span> / MECHLAB FUTURE</span></p>
        <h3>{plan.title}</h3>
        <p className="roadmap-intro">{plan.intro}</p>
        <ul>{plan.ideas.map((idea) => <li key={idea}>{idea}</li>)}</ul>
      </article>)}</div>
    </section>
    <section className="v2-cta lab-cta roadmap-cta"><div><p>BUILD IT WITH US</p><h2>Your next idea belongs in the lab.</h2><span>Tell us what you want to review, measure, or practice next.</span></div><a className="v2-button primary" href="mailto:support@mechlab.gg?subject=MechLab%20roadmap%20idea">Share an idea <span>→</span></a></section>
  </LabChrome>
}
