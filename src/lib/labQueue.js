/** Shared alpha status. Home and /roadmap stay in sync. */

export const shipped = [
  ['System status', 'Home shows if the engine, controller, Rocket League, overlay, and replay store are running.'],
  ['Pick a mechanic', 'Train lists the mechanics available today and starts a session for the one you choose.'],
  ['Bind check', 'We read your real Rocket League binds before we trust any timing numbers.'],
  ['Overlay', 'Start and stop the overlay from the desktop app. No second launcher.'],
  ['Fast Aerial', 'Live. We measure launch timing, boost start, and how clean the flight path is.'],
  ['Wave Dash', 'Live. We measure the land, the cancel, and whether you keep the ball.'],
  ['Half Flip', 'Live. We measure the flip cancel, the recovery turn, and your first useful input after.'],
]

export const underTest = [
  ['Rep detector', 'Finds and scores a rep. Still needs more messy freeplay reps before we trust it.'],
  ['Coach notes', 'Feedback can fire. We still need to learn if those notes actually help.'],
  ['Session save', 'We can capture and save a session. Opening old sessions again is still being tested.'],
  ['Score calibration', 'Sometimes clean misses score too high and messy hits score too low. We are fixing that.'],
  ['Overlay edge cases', 'Start and stop when you alt-tab, lose focus, or restart Rocket League.'],
]

export const queued = [
  ['Replay review', 'A review screen exists. Full coaching and measurement there is not done yet.'],
  ['Progress history', 'The page exists. History only matters once sessions are reliable.'],
  ['3D path view', 'Basic 3D review is in. Drawing, compare, and polish are not.'],
  ['Speed Flip', 'Next mechanic once Fast Aerial, Wave Dash, and Half Flip hold up in real use.'],
  ['Air dribble touch', 'Aerial control drill. Planned, not live.'],
  ['Ground to air', 'Transition timing drill. Sketched, not built.'],
  ['Compare sessions', 'Diff two runs of the same mechanic on one timeline.'],
  ['Shareable report', 'A short report with inputs, notes, and key frames. Not the full raw capture.'],
]

export const horizons = [
  {
    id: '1',
    title: 'Make the core loop reliable',
    summary: 'Launch, train, detect, score, save, and review should work every time on Windows.',
    items: [
      'Rep detector that survives messy freeplay',
      'Save and reopen sessions without data loss',
      'Clearer overlay start and stop states',
      'Bind check across common controllers',
    ],
  },
  {
    id: '2',
    title: 'Make review useful',
    summary: 'Replay should answer one question: what broke, and what to change next.',
    items: [
      'Timeline that leaves missing frames missing',
      'Notes on the same clock as your inputs',
      'Open saved reports without Rocket League running',
      'Mark a frame and carry one cue into the next session',
    ],
  },
  {
    id: '3',
    title: 'Add more mechanics',
    summary: 'More drills only after the first three hold up in real use.',
    items: [
      'Speed Flip, air dribble touch, ground to air',
      'Compare two sessions of the same mechanic',
      'Progress that only counts finished, trusted reps',
      'Export packs for coaches and training partners',
    ],
  },
  {
    id: '4',
    title: 'Help you keep practicing',
    summary: 'Practice plans and weekly summaries from your own sessions.',
    items: [
      'Practice plans aimed at your weak timing windows',
      'A weekly summary from your own sessions',
      'Optional share links that do not leak raw telemetry',
    ],
  },
]
