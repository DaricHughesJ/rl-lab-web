import { useEffect, useState } from 'react'
import { isSupabaseConfigured, signIn, signUpForBeta } from '../lib/supabase'

export default function AuthModal({ initialMode = 'signup', onClose }) {
  const [mode, setMode] = useState(initialMode)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  useEffect(() => { const close = (event) => event.key === 'Escape' && onClose(); addEventListener('keydown', close); return () => removeEventListener('keydown', close) }, [onClose])

  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(''); setSuccess('')
    const values = Object.fromEntries(new FormData(event.currentTarget))
    try {
      if (mode === 'signup') {
        const { data, error: authError } = await signUpForBeta(values)
        if (authError) throw authError
        if (data.session) onClose()
        else setSuccess('Check your inbox to confirm your email and activate your beta account.')
      } else {
        const { error: authError } = await signIn(values)
        if (authError) throw authError
        onClose()
      }
    } catch (authError) { setError(authError.message || 'Something went wrong. Please try again.') }
    finally { setBusy(false) }
  }

  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
      <div className="auth-brand"><i>✦</i><span>{mode === 'signup' ? 'FOUNDING PLAYER ACCESS' : 'WELCOME BACK'}</span></div>
      <h2 id="auth-title">{mode === 'signup' ? 'Join the MechLab beta.' : 'Sign in to your lab.'}</h2>
      <p>{mode === 'signup' ? 'Create your player profile and be first in line for mechanics intelligence.' : 'Pick up where your last training session left off.'}</p>
      {!isSupabaseConfigured && <div className="form-message error">Account services need the two public Supabase environment values before signups can open.</div>}
      {success ? <div className="confirmation"><i>✓</i><h3>You’re on the list.</h3><p>{success}</p><button className="button" onClick={onClose}>Done</button></div> : <form onSubmit={submit}>
        {mode === 'signup' && <><label>PLAYER NAME<input name="name" required autoComplete="name" placeholder="Your display name" /></label><div className="form-row"><label>CURRENT RANK<select name="rank" defaultValue="Champion"><option>Bronze–Gold</option><option>Platinum</option><option>Diamond</option><option>Champion</option><option>Grand Champion</option><option>Supersonic Legend</option></select></label><label>PLATFORM<select name="platform" defaultValue="PC"><option>PC</option><option>PlayStation</option><option>Xbox</option><option>Switch</option></select></label></div></>}
        <label>EMAIL<input type="email" name="email" required autoComplete="email" placeholder="you@example.com" /></label>
        <label>PASSWORD<input type="password" name="password" required minLength="8" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} placeholder="At least 8 characters" /></label>
        {error && <div className="form-message error" role="alert">{error}</div>}
        <button className="button auth-submit" disabled={busy || !isSupabaseConfigured}>{busy ? 'Working…' : mode === 'signup' ? 'Create beta account →' : 'Sign in →'}</button>
      </form>}
      {!success && <footer>{mode === 'signup' ? 'Already have an account?' : 'New to MechLab?'} <button onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError('') }}>{mode === 'signup' ? 'Sign in' : 'Join the beta'}</button></footer>}
    </section>
  </div>
}
