import { useEffect, useMemo, useState } from 'react'
import { BETA_FILE_NAME, BETA_VERSION } from '../lib/release'

const STORAGE_KEY = 'mechlab-install-wizard-v1'

const STEP_CONTENT = [
  {
    id: 'preflight',
    number: '01',
    title: 'Check your setup',
    eyebrow: 'WINDOWS PREP',
    summary: 'Confirm the machine and Rocket League workflow before you download anything.',
    points: [
      'Windows 10 or 11 on the PC you use for Rocket League.',
      'Freeplay and offline training are the supported beta workflows.',
      'SmartScreen may warn because the beta build is not code-signed yet.',
    ],
    checklist: [
      'I am on Windows 10 or 11.',
      'I will use MechLab for freeplay or offline training.',
      'I understand the first-run Windows warning is expected in beta.',
    ],
  },
  {
    id: 'download',
    number: '02',
    title: 'Download the beta build',
    eyebrow: 'OFFICIAL BUILD',
    summary: `Pull the current ${BETA_VERSION} installer package directly from the private beta download.`,
    points: [
      `${BETA_FILE_NAME} is the official Windows build for this beta.`,
      'Keep the file in Downloads or move it somewhere easy to find.',
      'If your account is not approved yet, the download remains locked.',
    ],
    checklist: [
      'I downloaded the current beta build.',
      'I know where the downloaded file is saved.',
    ],
  },
  {
    id: 'install',
    number: '03',
    title: 'Install and launch',
    eyebrow: 'FIRST RUN',
    summary: 'Run the downloaded executable, allow SmartScreen if needed, and open MechLab.',
    points: [
      'Open the downloaded file from your browser or Downloads folder.',
      'If SmartScreen appears, use More info then Run anyway for this beta build.',
      'Pin the app if you want faster repeat launches during practice blocks.',
    ],
    checklist: [
      'I opened the downloaded executable.',
      'MechLab launched on this machine.',
    ],
  },
  {
    id: 'signin',
    number: '04',
    title: 'Sign in and sync',
    eyebrow: 'ACCOUNT LINK',
    summary: 'Use the same account you approved on the site so your sessions sync back here.',
    points: [
      'Sign in with the same email you used for beta access.',
      'Complete a training session in the desktop app to populate this dashboard.',
      'BakkesMod telemetry is optional and only needed for supported telemetry-assisted mechanics.',
    ],
    checklist: [
      'I signed in to the desktop app with this account.',
      'I understand synced sessions will appear here after my first session.',
    ],
  },
]

function loadState() {
  if (typeof window === 'undefined') return {}
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export default function InstallWizard({ approved, onDownload, userEmail = '', compact = false, ctaLabel = 'Open install wizard' }) {
  const [open, setOpen] = useState(!compact)
  const [checks, setChecks] = useState(() => loadState())
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checks))
  }, [checks])

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timer)
  }, [copied])

  const completedSteps = useMemo(
    () => STEP_CONTENT.filter((step) => step.checklist.every((_, index) => checks[`${step.id}:${index}`])).length,
    [checks],
  )

  function toggle(stepId, index) {
    const key = `${stepId}:${index}`
    setChecks((current) => ({ ...current, [key]: !current[key] }))
  }

  async function copyEmail() {
    if (!userEmail || !navigator?.clipboard) return
    await navigator.clipboard.writeText(userEmail)
    setCopied(true)
  }

  return <section className={`install-wizard ${compact ? 'compact' : 'full'} ${approved ? 'approved' : 'locked'}`}>
    <div className="install-wizard-head">
      <div>
        <span>INSTALL WIZARD</span>
        <h2>{approved ? 'Set up MechLab on this PC' : 'Install unlocks after beta approval'}</h2>
        <p>{approved ? 'Move from approved account to first synced session without guessing the order.' : 'Your account can already request access here, but the Windows build download remains gated until approval.'}</p>
      </div>
      <div className="install-wizard-status">
        <b>{completedSteps}/{STEP_CONTENT.length}</b>
        <small>steps completed</small>
      </div>
      {compact && <button className="install-wizard-toggle" type="button" onClick={() => setOpen((value) => !value)}>{open ? 'Hide wizard' : ctaLabel}</button>}
    </div>

    {open && <>
      <div className="install-wizard-progress" aria-hidden="true">
        <i style={{ width: `${completedSteps / STEP_CONTENT.length * 100}%` }} />
      </div>

      <div className="install-wizard-grid">
        {STEP_CONTENT.map((step) => <article key={step.id} className="install-step">
          <header>
            <small>{step.eyebrow}</small>
            <span>{step.number}</span>
          </header>
          <h3>{step.title}</h3>
          <p>{step.summary}</p>
          <ul>
            {step.points.map((point) => <li key={point}>{point}</li>)}
          </ul>
          <div className="install-checks">
            {step.checklist.map((item, index) => {
              const key = `${step.id}:${index}`
              return <label key={key} className={checks[key] ? 'done' : ''}>
                <input type="checkbox" checked={Boolean(checks[key])} onChange={() => toggle(step.id, index)} />
                <span>{item}</span>
              </label>
            })}
          </div>
          {step.id === 'download' && <button className="button install-download" type="button" disabled={!approved} onClick={onDownload}>{approved ? `Download ${BETA_FILE_NAME}` : 'Waiting for approval'}</button>}
          {step.id === 'signin' && userEmail && <button className="install-copy" type="button" onClick={copyEmail}>{copied ? 'Email copied' : `Copy sign-in email: ${userEmail}`}</button>}
        </article>)}
      </div>
    </>}
  </section>
}
