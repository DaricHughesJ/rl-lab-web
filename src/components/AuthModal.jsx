import { useEffect, useState } from 'react'
import { isSupabaseConfigured, requestPasswordReset, signIn, signUpForBeta } from '../lib/supabase'

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
      } else if (mode === 'forgot') {
        const { error: authError } = await requestPasswordReset(values.email)
        if (authError) throw authError
        setSuccess('If an account exists for that address, a password reset link is on the way.')
      } else {
        const { error: authError } = await signIn(values)
        if (authError) throw authError
        onClose()
      }
    } catch (authError) { setError(authError.message || 'Something went wrong. Please try again.') }
    finally { setBusy(false) }
  }

  const signup = mode === 'signup'
  const forgot = mode === 'forgot'
  const title = signup ? 'Join the MechLab beta.' : forgot ? 'Reset your password.' : 'Sign in to your lab.'
  const intro = signup ? 'Create your player profile and request beta access.' : forgot ? 'Enter the email tied to your MechLab account.' : 'Access your beta download, synced sessions, mechanics, and account settings.'

  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
      <div className="auth-brand"><i>✦</i><span>{signup ? 'FOUNDING PLAYER ACCESS' : forgot ? 'ACCOUNT RECOVERY' : 'WELCOME BACK'}</span></div>
      <h2 id="auth-title">{title}</h2>
      <p>{intro}</p>
      {!isSupabaseConfigured && <div className="form-message error">Account services are not configured.</div>}
      {success ? <div className="confirmation"><i>✓</i><h3>{signup ? 'You’re on the list.' : 'Check your inbox.'}</h3><p>{success}</p><button className="button" onClick={onClose}>Done</button></div> : <form onSubmit={submit}>
        {signup && <><label>PLAYER NAME<input name="name" required autoComplete="name" placeholder="Your display name" /></label><div className="form-row"><label>CURRENT RANK<select name="rank" defaultValue="Champion"><option>Bronze–Gold</option><option>Platinum</option><option>Diamond</option><option>Champion</option><option>Grand Champion</option><option>Supersonic Legend</option></select></label><label>PLATFORM<select name="platform" defaultValue="PC"><option>PC</option><option>PlayStation</option><option>Xbox</option><option>Switch</option></select></label></div></>}
        <label>EMAIL<input type="email" name="email" required autoComplete="email" placeholder="you@example.com" /></label>
        {!forgot && <label>PASSWORD<input type="password" name="password" required minLength="8" autoComplete={signup ? 'new-password' : 'current-password'} placeholder="At least 8 characters" /></label>}
        {!signup && !forgot && <button type="button" className="auth-text-action" onClick={() => { setMode('forgot'); setError('') }}>Forgot password?</button>}
        {error && <div className="form-message error" role="alert">{error}</div>}
        <button className="button auth-submit" disabled={busy || !isSupabaseConfigured}>{busy ? 'Working…' : signup ? 'Create beta account →' : forgot ? 'Send reset link →' : 'Sign in →'}</button>
      </form>}
      {!success && <footer>{forgot ? <>Remembered it? <button onClick={() => { setMode('login'); setError('') }}>Back to sign in</button></> : <>{signup ? 'Already have an account?' : 'New to MechLab?'} <button onClick={() => { setMode(signup ? 'login' : 'signup'); setError('') }}>{signup ? 'Sign in' : 'Join the beta'}</button></>}</footer>}
    </section>
  </div>
}
