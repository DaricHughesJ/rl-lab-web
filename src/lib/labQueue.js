/** Shared alpha queue — home Lab notes + /roadmap stay in sync. */

export const shipped = [
  ['BENCH STATUS', 'Home shows whether the engine, controller, Rocket League, overlay, and replay store are up.'],
  ['SPECIMEN PICK', 'Train lists the mechanics that are wired today and starts a session for the one you choose.'],
  ['BIND CHECK', 'We read your real Rocket League binds before we trust any timing numbers.'],
  ['OVERLAY', 'Start and stop the overlay from the desktop app. No second launcher.'],
]

export const underTest = [
  ['REP DETECTOR', 'The path that finds and scores a rep is in. Still needs messy real-world reps before we call it solid.'],
  ['COACH NOTES', 'Feedback can fire. Whether those notes are actually useful is still an open question.'],
  ['SESSION LOG', 'We can capture and save a session. The full train → save → reopen loop is still getting stress-tested.'],
]

export const queued = [
  ['REPLAY BENCH', 'Review UI exists. Full coaching + measurement workflow is still unfinished.'],
  ['PROGRESS LEDGER', 'Route is there. History only matters once sessions are reliable.'],
  ['3D TRACE', '3D review foundation is in. Drawing, compare, and polish are not.'],
]

export const horizons = [
  {
    id: 'H1',
    title: 'Harden the loop',
    summary: 'Make launch → train → detect → score → save → review boringly reliable on Windows.',
    items: [
      'Rep detector through noisy freeplay reps',
      'Session save / reopen without data loss',
      'Clearer overlay start/stop states',
    ],
  },
  {
    id: 'H2',
    title: 'Make review useful',
    summary: 'Replay should answer one question: what broke, and what to change next.',
    items: [
      'Honest timeline with missing frames left missing',
      'Notes pinned to the same clock as inputs',
      'Offline open of saved reports',
    ],
  },
  {
    id: 'H3',
    title: 'Widen the rack',
    summary: 'More protocols once the first three hold up under real use.',
    items: [
      'Additional grounded and aerial mechanics',
      'Compare two sessions of the same protocol',
      'Progress that only counts finished, trusted reps',
    ],
  },
]
