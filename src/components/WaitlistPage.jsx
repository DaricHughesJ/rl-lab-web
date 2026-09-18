import { useEffect, useState } from 'react'
import LabChrome from './LabChrome'
import { captureUtms } from '../lib/utm'
import { submitWaitlist, track } from '../lib/waitlist'

const ranks = ['Diamond', 'Champion', 'Grand Champion', 'SSL', 'Other']
const mechanics = ['Fast Aerial', 'Wave Dash', 'Half Flip', 'Speed Flip', 'Flip Reset', 'Other']
const heard = ['YouTube', 'Reddit', 'Discord', 'Friend', 'Search', 'Other']

export default function WaitlistPage() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    captureUtms()
    track('page_view', { page: 'waitlist' })
  }, [])

  async function onSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const data = new FormData(event.currentTarget)
    try {
      await submitWaitlist({
        email: data.get('email'),
        display_name: data.get('display_name'),
        rank_bucket: data.get('rank_bucket'),
        mechanic_focus: data.get('mechanic_focus'),
        discord: data.get('discord'),
        heard_from: data.get('heard_from'),
      })
      window.location.href = '/thanks'
    } catch (err) {
      setError(err.message || 'Could not save your request.')
      setBusy(false)
    }
  }

  return (
    <LabChrome active="waitlist">
      <header className="lab-hero">
        <p className="v2-specimen">EARLY ACCESS</p>
        <h1>Get on the waitlist.</h1>
        <p className="lab-lede">
          Built for Champion to GC grinders on PC who train with EAC off. Email is enough. Optional fields help us prioritize.
        </p>
      </header>

      <section className="v2-section dbg-waitlist">
        <form className="dbg-form" onSubmit={onSubmit}>
          <label>
            EMAIL
            <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
          </label>

          <button type="button" className="dbg-more" onClick={() => setShowMore((v) => !v)}>
            {showMore ? 'Hide optional fields' : 'Add optional details'}
          </button>

          {showMore && (
            <div className="dbg-optional">
              <label>
                DISPLAY NAME
                <input name="display_name" autoComplete="nickname" placeholder="Optional" />
              </label>
              <div className="dbg-form-row">
                <label>
                  RANK BAND
                  <select name="rank_bucket" defaultValue="">
                    <option value="">Optional</option>
                    {ranks.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </label>
                <label>
                  MECHANIC FOCUS
                  <select name="mechanic_focus" defaultValue="">
                    <option value="">Optional</option>
                    {mechanics.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </label>
              </div>
              <label>
                DISCORD
                <input name="discord" placeholder="Optional" />
              </label>
              <label>
                HOW YOU HEARD ABOUT US
                <select name="heard_from" defaultValue="">
                  <option value="">Optional</option>
                  {heard.map((h) => <option key={h}>{h}</option>)}
                </select>
              </label>
            </div>
          )}

          {error && <div className="dbg-form-error" role="alert">{error}</div>}
          <button className="v2-button primary" disabled={busy} type="submit">
            {busy ? 'Saving…' : 'Request access →'}
          </button>
          <p className="dbg-form-note">No charge to join. We email when alpha seats open. Already have an account? <a href="/signin">Sign in</a>.</p>
        </form>
      </section>
    </LabChrome>
  )
}
