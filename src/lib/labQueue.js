/** Shared alpha queue — home Lab notes + /roadmap stay in sync. */

export const shipped = [
  ['BENCH STATUS', 'Home shows whether the engine, controller, Rocket League, overlay, and replay store are up.'],
  ['SPECIMEN PICK', 'Train lists the mechanics wired today and starts a session for the one you choose.'],
  ['BIND CHECK', 'We read your real Rocket League binds before we trust any timing numbers.'],
  ['OVERLAY', 'Start and stop the overlay from the desktop app. No second launcher.'],
  ['FA-01 FAST AERIAL', 'Protocol live: launch window, boost onset, path cleanliness.'],
  ['WD-02 WAVE DASH', 'Protocol live: land timing, cancel, whether you keep the ball.'],
  ['HF-03 HALF FLIP', 'Protocol live: flip cancel, recovery turn, first useful input after.'],
]

export const underTest = [
  ['REP DETECTOR', 'Finds and scores a rep. Still needs messy freeplay noise before we call it solid.'],
  ['COACH NOTES', 'Feedback can fire. Whether those notes change how you play is still open.'],
  ['SESSION LOG', 'Capture and save works. Full train → save → reopen is still getting stress-tested.'],
  ['FALSE-POSITIVE SWEEP', 'Scoring clean misses and messy hits too kindly — calibration pass in progress.'],
  ['OVERLAY EDGE CASES', 'Start/stop under alt-tab, focus loss, and Rocket League restarts.'],
]

export const queued = [
  ['REPLAY BENCH', 'Review UI exists. Full coaching + measurement workflow still unfinished.'],
  ['PROGRESS LEDGER', 'Route is there. History only matters once sessions are reliable.'],
  ['3D TRACE', '3D review foundation is in. Drawing, compare, and polish are not.'],
  ['SPEED FLIP (SF-04)', 'Next protocol on the rack once FA / WD / HF hold up under real reps.'],
  ['AIR DRIBBLE TOUCH (AD-05)', 'Aerial control protocol — in prep, not live.'],
  ['GROUND TO AIR (GA-06)', 'Transition timing protocol — sketched, not wired.'],
  ['SESSION COMPARE', 'Diff two runs of the same protocol on one clock.'],
  ['EXPORT PACK', 'Shareable report (inputs + notes + key frames) without the full raw capture.'],
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
      'Bind check across common controller layouts',
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
      'Mark a frame and take one cue into the next session',
    ],
  },
  {
    id: 'H3',
    title: 'Widen the rack',
    summary: 'More protocols once the first three hold up under real use.',
    items: [
      'Speed Flip, Air Dribble touch, Ground-to-Air',
      'Compare two sessions of the same protocol',
      'Progress that only counts finished, trusted reps',
      'Pack export for coaches / training partners',
    ],
  },
  {
    id: 'H4',
    title: 'Close the feedback loop',
    summary: 'Turn measurement into a habit, not a one-off screenshot.',
    items: [
      'Streak-free practice plans keyed to weak windows',
      'Weekly lab digest from your own sessions',
      'Optional share links that don’t leak raw telemetry',
    ],
  },
]
