import { useEffect, useRef, useState } from 'react'
import {
  CONFIRMATION_RESEND_COOLDOWN_MS,
  confirmationCooldownSeconds,
  isEmailNotConfirmedError,
} from '../lib/authVerification'
import { isSupabaseConfigured, requestPasswordReset, resendSignupConfirmation, signIn, signUpForBeta } from '../lib/supabase'

export default function AuthModal({ initialMode = 'signup', onClose }) {
  const [mode, setMode] = useState(initialMode)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [confirmationEmail, setConfirmationEmail] = useState('')
  const [resendAvailableAt, setResendAvailableAt] = useState(0)
  const [resendNow, setResendNow] = useState(Date.now())
  const [resendBusy, setResendBusy] = useState(false)
  const [resendError, setResendError] = useState('')
  const [resendSuccess, setResendSuccess] = useState('')
  const resendRequestId = useRef(0)
  useEffect(() => { const close = (event) => event.key === 'Escape' && onClose(); addEventListener('keydown', close); return () => removeEventListener('keydown', close) }, [onClose])
  useEffect(() => () => { resendRequestId.current += 1 }, [])
  useEffect(() => {
    if (!confirmationEmail || !resendAvailableAt) return undefined
    const timer = setInterval(() => {
      const now = Date.now()
      setResendNow(now)
      if (now >= resendAvailableAt) clearInterval(timer)
    }, 1_000)
    return () => clearInterval(timer)
  }, [confirmationEmail, resendAvailableAt])

  function showVerificationPending(email) {
    const now = Date.now()
    resendRequestId.current += 1
    setConfirmationEmail(email.trim())
    setResendAvailableAt(now + CONFIRMATION_RESEND_COOLDOWN_MS)
    setResendNow(now)
    setResendError('')
    setResendSuccess('')
    setResendBusy(false)
  }

  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(''); setSuccess('')
    const values = Object.fromEntries(new FormData(event.currentTarget))
    try {
      if (mode === 'signup') {
        const { data, error: authError } = await signUpForBeta(values)
        if (authError) throw authError
        if (data.session) onClose()
        else showVerificationPending(data.user?.email || values.email)
      } else if (mode === 'forgot') {
        const { error: authError } = await requestPasswordReset(values.email)
        if (authError) throw authError
        setSuccess('If an account exists for that address, a password reset link is on the way.')
      } else {
        const { error: authError } = await signIn(values)
        if (authError && isEmailNotConfirmedError(authError)) {
          showVerificationPending(values.email)
          return
        }
        if (authError) throw authError
        onClose()
      }
    } catch (authError) { setError(authError.message || 'Something went wrong. Please try again.') }
    finally { setBusy(false) }
  }

  const resendCooldown = confirmationCooldownSeconds(resendAvailableAt, resendNow)

  async function resendConfirmation() {
    if (!confirmationEmail || resendBusy || resendCooldown > 0) return
    const requestId = ++resendRequestId.current
    setResendBusy(true)
    setResendError('')
    setResendSuccess('')
    try {
      const { error: authError } = await resendSignupConfirmation(confirmationEmail)
      if (authError) throw authError
      if (requestId !== resendRequestId.current) return
      const now = Date.now()
      setResendAvailableAt(now + CONFIRMATION_RESEND_COOLDOWN_MS)
      setResendNow(now)
      setResendSuccess('A new verification link is on the way.')
    } catch (authError) {
      if (requestId !== resendRequestId.current) return
      setResendError(authError.message || 'We could not resend the verification email. Please try again.')
    } finally {
      if (requestId === resendRequestId.current) setResendBusy(false)
    }
  }

  function returnToSignIn() {
    resendRequestId.current += 1
    setConfirmationEmail('')
    setResendBusy(false)
    setMode('login')
    setError('')
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
      {confirmationEmail ? <div className="confirmation verification-pending">
        <i aria-hidden="true">@</i>
        <h3>Verify your email.</h3>
        <p>We sent a verification link to <strong>{confirmationEmail}</strong>. Open it before signing in to activate your account.</p>
        {resendSuccess && <div className="form-message success" role="status">{resendSuccess}</div>}
        {resendError && <div className="form-message error" role="alert">{resendError}</div>}
        <button className="button" type="button" onClick={resendConfirmation} disabled={resendBusy || resendCooldown > 0}>
          {resendBusy ? 'Sending…' : resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : 'Resend verification email'}
        </button>
        <button className="auth-text-action confirmation-back" type="button" onClick={returnToSignIn}>Back to sign in</button>
      </div> : success ? <div className="confirmation"><i>✓</i><h3>{signup ? 'You’re on the list.' : 'Check your inbox.'}</h3><p>{success}</p><button className="button" onClick={onClose}>Done</button></div> : <form onSubmit={submit}>
        {signup && <><label>PLAYER NAME<input name="name" required autoComplete="name" placeholder="Your display name" /></label><div className="form-row"><label>CURRENT RANK<select name="rank" defaultValue="Champion"><option>Bronze–Gold</option><option>Platinum</option><option>Diamond</option><option>Champion</option><option>Grand Champion</option><option>Supersonic Legend</option></select></label><label>PLATFORM<select name="platform" defaultValue="PC"><option>PC</option><option>PlayStation</option><option>Xbox</option><option>Switch</option></select></label></div></>}
        <label>EMAIL<input type="email" name="email" required autoComplete="email" placeholder="you@example.com" /></label>
        {!forgot && <label>PASSWORD<input type="password" name="password" required minLength="8" autoComplete={signup ? 'new-password' : 'current-password'} placeholder="At least 8 characters" /></label>}
        {!signup && !forgot && <button type="button" className="auth-text-action" onClick={() => { setMode('forgot'); setError('') }}>Forgot password?</button>}
        {error && <div className="form-message error" role="alert">{error}</div>}
        <button className="button auth-submit" disabled={busy || !isSupabaseConfigured}>{busy ? 'Working…' : signup ? 'Create beta account →' : forgot ? 'Send reset link →' : 'Sign in →'}</button>
      </form>}
      {!success && !confirmationEmail && <footer>{forgot ? <>Remembered it? <button onClick={() => { setMode('login'); setError('') }}>Back to sign in</button></> : <>{signup ? 'Already have an account?' : 'New to MechLab?'} <button onClick={() => { setMode(signup ? 'login' : 'signup'); setError('') }}>{signup ? 'Sign in' : 'Join the beta'}</button></>}</footer>}
    </section>
  </div>
}
