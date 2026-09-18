/** Static blog posts. Newest first. */

export const posts = [
  {
    slug: 'stop-guessing-the-miss',
    date: '2026-09-12',
    title: 'Stop guessing the miss',
    summary: '"Feels late" is not a training plan. Measure the rep. Change one thing. Run it again.',
    tags: ['product', 'alpha'],
    body: [
      'Most mechanic practice ends the same way. You miss, guess why, and try again on feel. Was the jump early? Boost late? Air roll dirty? You pick an answer that sounds right and hope the next one sticks.',
      'MechLab is a Windows desktop app for Rocket League mechanics. You pick a drill, we record the rep, then you look at timing, inputs, and path. Not a rank badge. Not a vibe score. Numbers you can check.',
      'We start with three drills on purpose: Fast Aerial, Wave Dash, and Half Flip. Same capture path for each, so Tuesday and Friday mean the same thing. When those three hold up in messy freeplay, we add more.',
      'Alpha is for people who will break the detector and tell us where the numbers are wrong. Request access, run sessions, send the ugly ones. The public roadmap is at /roadmap.',
    ],
  },
  {
    slug: 'lab-theme-and-honest-labels',
    date: '2026-09-12',
    title: 'Clearer site, honest labels',
    summary: 'We cleaned up the marketing site and kept unfinished work labeled unfinished.',
    tags: ['site', 'alpha'],
    body: [
      'MechLab is a desktop app for Rocket League mechanics. The site should say what the product does, not dress it up as finished SaaS.',
      'We updated the look and kept the home page honest about what ships, what is under test, and what is still queued. Alpha means unfinished. We say that out loud.',
      'We also fixed mobile bugs: a clipped nav brand, badges covering mechanic titles, and a Replay Coach image that did not match the rest of the site.',
      'Roadmap and this blog are public. If you are in alpha, keep sending broken sessions.',
    ],
  },
  {
    slug: 'what-a-mechlab-drill-is',
    date: '2026-09-05',
    title: 'What a MechLab drill is',
    summary: 'A drill is a repeatable test: same mechanic, same capture, numbers you can compare between sessions.',
    tags: ['train', 'mechanics'],
    body: [
      'A MechLab drill is a fixed test: the mechanic you run, the signals we capture, and the timing windows we care about. It is not a freeplay map pack with a cool name.',
      'Fast Aerial measures launch timing, boost start, and how clean the path stays. Wave Dash measures the land, the cancel, and whether you keep the ball. Half Flip measures the flip cancel, the recovery turn, and the first useful input after.',
      'Because capture is the same each time, you can compare Tuesday Fast Aerial to Friday Fast Aerial without translating between two different training modes.',
      'Speed Flip, air dribble touch, and ground to air are planned for later. They stay queued until the first three survive real binds and messy reps.',
    ],
  },
  {
    slug: 'three-mechanics-first',
    date: '2026-08-28',
    title: 'Three mechanics first',
    summary: 'Fast Aerial, Wave Dash, and Half Flip are the drills we harden first.',
    tags: ['train', 'mechanics'],
    body: [
      'We are not shipping a huge mechanic library on day one. Three drills is enough to prove the loop: pick a mechanic, run the rep, capture timing and inputs, look at what happened.',
      'Fast Aerial covers launch and path. Wave Dash covers land and cancel. Half Flip covers recovery and the first useful input after.',
      'More drills stay planned until these three survive messy freeplay and bind edge cases.',
    ],
  },
  {
    slug: 'replay-without-fake-motion',
    date: '2026-08-21',
    title: 'Replay without fake motion',
    summary: 'Missing frames stay missing. Notes sit on the same clock as the input that failed.',
    tags: ['replay', 'product'],
    body: [
      'A lot of coaching UIs invent motion between samples and call it polish. MechLab replay does not. If we did not capture a frame, we do not draw it.',
      'Review lines up inputs, telemetry, and notes on one clock. You scrub a finished attempt, mark where it broke, and take one change into the next run.',
      'That workflow is still unfinished. It is listed on the public roadmap. Honest playback comes before a pretty lie.',
      'When session save and reopen is solid, offline reports come next. Open the session without Rocket League running.',
    ],
  },
  {
    slug: 'why-we-read-your-binds',
    date: '2026-08-14',
    title: 'Why we read your binds',
    summary: 'Timing numbers are worthless if we assume the wrong jump or boost button.',
    tags: ['desktop', 'setup'],
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
    summary: 'What open alpha actually means if you join.',
    tags: ['alpha'],
    body: [
      'Alpha access is for people who will break the loop and say where the numbers are wrong. Features will move. Scoring will move. Some days the detector will miss a clean rep. Some days it will score a messy one too kindly.',
      'We keep a public list of what ships, what is under test, and what is not done yet. Prefer that over a fake complete checklist.',
      'Thanks for running sessions. Support is support@mechlab.gg.',
    ],
  },
]

export function getPost(slug) {
  const aliases = {
    'what-a-protocol-actually-is': 'what-a-mechlab-drill-is',
    'three-protocols-on-the-rack': 'three-mechanics-first',
    'replay-without-the-theater': 'replay-without-fake-motion',
  }
  const resolved = aliases[slug] || slug
  return posts.find((p) => p.slug === resolved) || null
}
