export const CONFIRMATION_RESEND_COOLDOWN_MS = 60_000

export function isEmailNotConfirmedError(error) {
  const code = String(error?.code || '').toLowerCase()
  const message = String(error?.message || '').toLowerCase()
  return code === 'email_not_confirmed' || message.includes('email not confirmed')
}

export function confirmationCooldownSeconds(availableAt, now = Date.now()) {
  return Math.max(0, Math.ceil((availableAt - now) / 1_000))
}
