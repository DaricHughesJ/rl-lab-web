/** Static blog posts. Newest first. */

export const posts = [
  {
    slug: 'fifteen-mechanics-one-practice-loop',
    date: '2026-10-10',
    title: 'Fifteen mechanics. One practice loop.',
    summary: 'MechLab brings measured mechanics, aligned coaching, controller heatmaps and corrected replays into the desktop workflow.',
    tags: ['product', 'training', 'replay'],
    body: [
      'MechLab now brings all 15 measured mechanics into one desktop practice loop. Pick a mechanic, follow a cue alongside the game, then open the attempt in Replay Coach.',
      'Replay Coach keeps the moment and the inputs together. Stick heatmaps show where recorded movement spent time; controller-aware labels and FAR/DAR controls carry through the replay and its simulation view.',
      'Corrected replays let you explore a bounded input change in simulation. MechLab starts with the original recorded controls, changes only the selected window, then resumes the recorded inputs. The original rep stays there as your baseline.',
      'You can also shape the data flow. Account settings expose progress sync, usage analytics, and training-data contribution, with queue recovery and account-data erasure tools alongside them.',
    ],
  },
  {
    slug: 'stop-guessing-the-miss',
    date: '2026-09-12',
    title: 'Stop guessing the miss',
    summary: '"Feels late" is not a training plan. Measure the rep. Change one thing. Run it again.',
    tags: ['product', 'alpha'],
    body: [
      'Most mechanic practice ends the same way. You miss, guess why, and try again on feel. Was the jump early? Boost late? Air roll dirty? You pick an answer that sounds right and hope the next one sticks.',
      'MechLab is a Windows desktop app for Rocket League mechanics. You pick a drill, we record the rep, then you look at timing, inputs, and path. Not a rank badge. Not a vibe score. Numbers you can check.',
      'MechLab brings all 15 measured mechanics into one practice workflow. Each attempt has a live cue and a review path so you can make an adjustment and run the rep again.',
      'Alpha is for people who will break the detector and tell us where the numbers are wrong. Request access, run sessions, send the ugly ones. The public roadmap is at /roadmap.',
    ],
  },
  {
    slug: 'lab-theme-and-honest-labels',
    date: '2026-09-12',
    title: 'Clearer site, honest labels',
    summary: 'A clearer look at the full MechLab practice loop, from first drill to replay review.',
    tags: ['site', 'alpha'],
    body: [
      'MechLab is a desktop app for Rocket League mechanics. The site should say what the product does, not dress it up as finished SaaS.',
      'The product story now starts with the full training loop: all 15 mechanics, live coaching, replay inputs, heatmaps, and corrected replays.',
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
      'Each mechanic focuses on the actions that make that rep distinct, while MechLab keeps coaching and scoring aligned to the same active window.',
      'Replay Coach helps you compare what you did with the moment you want to improve, including the recorded controller inputs.',
      'The library spans movement, aerial control, resets, and shots, so you can follow the mechanic that matters to your game.',
    ],
  },
  {
    slug: 'three-mechanics-first',
    date: '2026-08-28',
    title: 'One practice loop, fifteen mechanics',
    summary: 'The training library now covers all 15 mechanics in one desktop workflow.',
    tags: ['train', 'mechanics'],
    body: [
      'A practice loop should feel the same whichever mechanic you choose: pick the rep, work with a live cue, capture your inputs, and review what happened.',
      'MechLab now offers all 15 measured mechanics, from movement and dashes to advanced aerial plays, resets, and shots.',
      'Replay Coach and its corrected-replay simulations carry that loop into the next attempt.',
    ],
  },
  {
    slug: 'replay-without-fake-motion',
    date: '2026-08-21',
    title: 'Replay without fake motion',
    summary: 'Missing frames stay missing. Notes sit on the same clock as the input that failed.',
    tags: ['replay', 'product'],
    body: [
      'Replay Coach brings controller inputs, session timing, and game context together so you can return to a specific moment in a finished attempt.',
      'Stick heatmaps show where your recorded movement spent time. Controller labels and FAR/DAR inputs stay available through replay and simulation.',
      'Corrected replays let you apply a bounded input change in simulation and then resume the controls from your original recording.',
      'Use the original attempt as a baseline, explore one change, and carry the next cue back into training.',
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
      'MechLab uses the bindings it detects to make live guides and controller labels match your setup.',
    ],
  },
  {
    slug: 'what-to-expect-from-mechlab',
    date: '2026-07-30',
    title: 'What to expect from MechLab',
    summary: 'What open alpha actually means if you join.',
    tags: ['alpha'],
    body: [
      'The MechLab beta is for players who want a clearer practice loop: fifteen mechanics, cues beside the game, controller heatmaps, and replay-based input experiments.',
      'Account settings put progress sync, analytics, and training-data contribution in your hands, with tools to recover uploads and erase account data.',
      'Thanks for training with MechLab. Support is support@mechlab.gg.',
    ],
  },
]

export function getPost(slug) {
  const aliases = {
    'what-a-protocol-actually-is': 'what-a-mechlab-drill-is',
    'three-protocols-on-the-rack': 'three-mechanics-first',
    'replay-without-the-theater': 'replay-without-fake-motion',
    'alpha-means-unfinished': 'what-to-expect-from-mechlab',
  }
  const resolved = aliases[slug] || slug
  return posts.find((p) => p.slug === resolved) || null
}
