import assert from 'node:assert/strict'
import test from 'node:test'

import {
  confirmationCooldownSeconds,
  isEmailNotConfirmedError,
} from '../src/lib/authVerification.js'

test('recognizes Supabase email-not-confirmed errors by code or message', () => {
  assert.equal(isEmailNotConfirmedError({ code: 'email_not_confirmed' }), true)
  assert.equal(isEmailNotConfirmedError({ message: 'Email not confirmed' }), true)
  assert.equal(isEmailNotConfirmedError({ code: 'invalid_credentials' }), false)
})

test('reports a stable, non-negative resend cooldown', () => {
  assert.equal(confirmationCooldownSeconds(61_001, 1_000), 61)
  assert.equal(confirmationCooldownSeconds(61_001, 1_001), 60)
  assert.equal(confirmationCooldownSeconds(1_000, 1_001), 0)
})
