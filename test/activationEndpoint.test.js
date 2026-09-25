import test from 'node:test'
import assert from 'node:assert/strict'
import worker from '../src/worker.js'

const activationKey = 'ML-TEST-KEY-DO-NOT-USE'
const env = {
  SUPABASE_URL: 'https://supabase.example',
  SUPABASE_KEY_SECRET: 'server-only-test-secret',
}

function request(key = activationKey, headers = {}) {
  return new Request('https://mechlab.test/api/account/activate', {
    method: 'POST',
    headers: { Authorization: 'Bearer valid-session', Origin: 'https://mechlab.test', 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ key }),
  })
}

async function withSupabaseResult(t, rpcResult) {
  const calls = []
  t.mock.method(globalThis, 'fetch', async (input, init = {}) => {
    const url = String(input)
    calls.push({ url, init })
    if (url.endsWith('/auth/v1/user')) return Response.json({ id: 'test-user-id' })
    if (url.endsWith('/rest/v1/rpc/redeem_mechlab_activation_key_self')) return Response.json(rpcResult)
    throw new Error('Unexpected network request')
  })
  return calls
}

test('activation validates the session and returns success without echoing the key', async (t) => {
  const calls = await withSupabaseResult(t, 'activated')
  const response = await worker.fetch(request(), env)
  const body = await response.text()

  assert.equal(response.status, 200)
  assert.deepEqual(JSON.parse(body), { activated: true })
  assert.equal(body.includes(activationKey), false)
  assert.equal(calls.length, 2)
  const rpc = JSON.parse(calls[1].init.body)
  assert.equal(rpc.p_key, activationKey)
  assert.equal(rpc.p_user_id, undefined)
  assert.equal(calls[1].init.headers.apikey, env.SUPABASE_KEY_SECRET)
  assert.equal(calls[1].init.headers.Authorization, 'Bearer valid-session')
})

test('activation returns distinct safe errors for invalid, expired, and used keys', async (t) => {
  let rpcStatus
  const calls = []
  t.mock.method(globalThis, 'fetch', async (input, init = {}) => {
    const url = String(input)
    calls.push({ url, init })
    if (url.endsWith('/auth/v1/user')) return Response.json({ id: 'test-user-id' })
    if (url.endsWith('/rest/v1/rpc/redeem_mechlab_activation_key_self')) return Response.json(rpcStatus)
    throw new Error('Unexpected network request')
  })
  for (const [statusValue, expectedStatus, expectedCode] of [
    ['invalid', 400, 'invalid'],
    ['expired', 410, 'expired'],
    ['already_used', 409, 'already_used'],
  ]) {
    rpcStatus = statusValue
    calls.length = 0
    const response = await worker.fetch(request(), env)
    const body = await response.text()
    assert.equal(response.status, expectedStatus)
    assert.deepEqual(JSON.parse(body), { error: expectedCode })
    assert.equal(body.includes(activationKey), false)
    assert.equal(calls.length, 2)
  }
})

test('activation refuses requests without a signed-in session before database access', async (t) => {
  let called = false
  t.mock.method(globalThis, 'fetch', async () => { called = true; return Response.json({ id: 'unexpected' }) })
  const response = await worker.fetch(request(activationKey, { Authorization: '' }), env)
  assert.equal(response.status, 401)
  assert.deepEqual(await response.json(), { error: 'sign_in_required' })
  assert.equal(called, false)
})
