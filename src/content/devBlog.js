/** Static lab log. Newest first. */

export const posts = [
  {
    slug: 'stop-guessing-the-miss',
    date: '2026-09-12',
    title: 'Stop guessing the miss',
    summary: 'MechLab exists because “feels late” is not a training plan. Measure the rep. Change one thing. Run it again.',
    tags: ['product', 'alpha'],
    body: [
      'Most mechanic practice ends the same way: you whiff, shrug, and queue another attempt on vibes. Was the jump early? Boost late? Air roll dirty? You pick an answer that feels right and hope the next one sticks.',
      'MechLab is a desktop lab for Rocket League mechanics. You pick a protocol, we record the rep—timing, inputs, path—then you look at what actually happened. Not a rank badge. Not a vibes score. A readout you can argue with.',
      'The first rack is small on purpose: Fast Aerial, Wave Dash, Half Flip. Same capture loop for each, so a Tuesday session and a Friday session mean the same thing. When those three hold up under messy freeplay, we widen the rack.',
      'Alpha is open for people who will break the detector and tell us where the numbers lie. Request bench access, run sessions, send the ugly ones. The public queue is at /roadmap.',
    ],
  },
  {
    slug: 'lab-theme-and-honest-labels',
    date: '2026-09-12',
    title: 'Lab chrome, fewer vibes',
    summary: 'The marketing site got a colder instrument look. We also stopped dressing unfinished work as finished.',
    tags: ['site', 'alpha'],
    body: [
      'MechLab is a desktop lab for Rocket League mechanics. The site should read that way—specimen IDs, protocol traces, status blocks—not another purple SaaS landing page.',
      'We swapped the marketing surface to IBM Plex, teal instrument accents, and clipped panels. The home page still shows what’s wired, what’s under test, and what’s queued. Alpha means unfinished; we label that.',
      'We also fixed mobile bugs: the nav brand was stacking and clipping under the clip-path, mechanic cards had badges sitting on titles baked into the art, and the Replay Coach mock still looked like a different product.',
      'Roadmap and this lab log are public now. If you’re on the alpha list, keep sending broken sessions.',
    ],
  },
  {
    slug: 'what-a-protocol-actually-is',
    date: '2026-09-05',
    title: 'What a protocol actually is',
    summary: 'A MechLab protocol is a repeatable test: same mechanic, same capture, numbers you can compare between sessions.',
    tags: ['train', 'protocols'],
    body: [
      'A protocol is not a pack of freeplay maps with a cool name. It is a fixed specimen: the mechanic you run, the signals we capture, and the windows we care about.',
      'Fast Aerial (FA-01) clocks launch window, boost onset, and how clean the path stays. Wave Dash (WD-02) tracks the land, the cancel, and whether you keep the ball. Half Flip (HF-03) times the flip cancel, the recovery turn, and the first useful input after.',
      'Because the capture path is shared, you can compare Tuesday’s FA-01 to Friday’s FA-01 without translating between two different “training modes.” That is the whole point.',
      'Speed Flip, Air Dribble touch, and Ground-to-Air are sketched for later. They stay queued until the first three survive real binds and messy reps.',
    ],
  },
  {
    slug: 'three-protocols-on-the-rack',
    date: '2026-08-28',
    title: 'Three protocols on the rack',
    summary: 'Fast Aerial, Wave Dash, and Half Flip are the mechanics we harden first.',
    tags: ['train', 'protocols'],
    body: [
      'We are not shipping a giant mechanic library on day one. Three protocols is enough to prove the loop: pick a specimen, run the rep, capture timing and inputs, look at what happened.',
      'Fast Aerial covers launch window and path. Wave Dash covers land + cancel. Half Flip covers recovery and the first useful input after.',
      'More protocols stay in prep until these three survive messy freeplay reps and bind edge cases. Patience here is a feature.',
    ],
  },
  {
    slug: 'replay-without-the-theater',
    date: '2026-08-21',
    title: 'Replay without the theater',
    summary: 'Review should keep gaps honest. Missing frames stay missing. The note you leave should sit on the same clock as the input that failed.',
    tags: ['replay', 'product'],
    body: [
      'A lot of “coaching UIs” invent motion between samples and call it polish. MechLab’s replay bench is being built the other way: if we didn’t capture it, we don’t draw it.',
      'The review surface lines up inputs, telemetry, and notes on one clock. You scrub a finished attempt, mark where it broke, and take one change into the next run.',
      'That workflow is still unfinished—queued as Replay Bench on the public roadmap—but the rule is already set. Honest playback beats a pretty lie.',
      'When session save/reopen is solid, offline reports come next: open the trial without Rocket League running.',
    ],
  },
  {
    slug: 'why-we-read-your-binds',
    date: '2026-08-14',
    title: 'Why we read your binds',
    summary: 'Timing numbers are worthless if we assume the wrong jump or boost button.',
    tags: ['desktop', 'calibration'],
    body: [
      'Before a train session, MechLab reads your real Rocket League binds. That is boring work, and it is required.',
      'If we guess your jump or boost, every launch window and cancel time is fiction. Better to fail the bind check than invent a score.',
      'If bind reading fails on your setup, tell us. That is a blocker, not a polish item.',
    ],
  },
  {
    slug: 'alpha-means-unfinished',
    date: '2026-07-30',
    title: 'Alpha means unfinished',
    summary: 'What “open notes” actually means for testers.',
    tags: ['alpha'],
    body: [
      'Alpha access is for people who will break the loop and say where the numbers lie. Features will move. Scoring thresholds will move. Some days the detector will miss a clean rep; some days it will score a messy one too kindly.',
      'We keep a public queue of what is shipping, what is under test, and what is not done yet. Prefer that over a fake “100% complete” checklist.',
      'Thanks for running sessions. Support is support@mechlab.gg.',
    ],
  },
]

export function getPost(slug) {
  return posts.find((p) => p.slug === slug) || null
}
