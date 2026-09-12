/** Static lab log. Newest first. */

export const posts = [
  {
    slug: 'lab-theme-and-honest-labels',
    date: '2026-09-12',
    title: 'Lab chrome, fewer vibes',
    summary: 'The marketing site got a colder instrument look. We also stopped dressing unfinished work as finished.',
    tags: ['site', 'alpha'],
    body: [
      'MechLab is a desktop lab for Rocket League mechanics. The site should read that way—specimen IDs, protocol traces, status blocks—not another purple SaaS landing page.',
      'We swapped the marketing surface to IBM Plex, teal instrument accents, and clipped panels. The home page still shows what’s wired, what’s under test, and what’s queued. Alpha means unfinished; we label that.',
      'We also fixed a few mobile bugs: the nav brand was stacking and clipping under the clip-path, mechanic cards had badges sitting on top of titles baked into the art, and the Replay Coach mock still looked like a different product. Those are cleaned up.',
      'If you’re on the alpha list, keep sending broken sessions. The roadmap is public now at /roadmap.',
    ],
  },
  {
    slug: 'three-protocols-on-the-rack',
    date: '2026-08-28',
    title: 'Three protocols on the rack',
    summary: 'Fast Aerial, Wave Dash, and Half Flip are the mechanics we will harden first.',
    tags: ['train', 'protocols'],
    body: [
      'We are not shipping a giant mechanic library on day one. Three protocols is enough to prove the loop: pick a specimen, run the rep, capture timing and inputs, look at what happened.',
      'Fast Aerial covers launch window and path. Wave Dash covers land + cancel. Half Flip covers recovery and the first useful input after. Same capture path for each so numbers can be compared between sessions.',
      'More protocols stay in prep until these three survive messy freeplay reps and bind edge cases.',
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
