import test from 'node:test'
import assert from 'node:assert/strict'
import worker from '../src/worker.js'
import { BETA_DOWNLOAD_URL } from '../src/lib/release.js'

test('disabled and banned accounts cannot download the beta', async (t) => {
  let accountStatus = 'disabled'
  const requestedUrls = []
  t.mock.method(globalThis, 'fetch', async (input) => {
    const url = String(input)
    requestedUrls.push(url)
    if (url.endsWith('/auth/v1/user')) return Response.json({ id: 'user-1' })
    if (url.includes('/rest/v1/profiles?')) return Response.json([{ beta_access: true, account_status: accountStatus }])
    throw new Error(`Unexpected request: ${url}`)
  })

  const env = {
    SUPABASE_URL: 'https://supabase.example',
    SUPABASE_KEY_SECRET: 'server-only-test-secret',
    BETA_DOWNLOADS: { get: async () => { throw new Error('Download storage must not be read') } },
  }

  for (accountStatus of ['disabled', 'banned']) {
    requestedUrls.length = 0
    const response = await worker.fetch(new Request(`https://mechlab.test${BETA_DOWNLOAD_URL}`, {
      headers: { Authorization: 'Bearer valid-session' },
    }), env)

    assert.equal(response.status, 403)
    assert.deepEqual(await response.json(), { error: 'Account is not active' })
    assert.equal(requestedUrls.length, 2)
    assert.equal(requestedUrls.some((url) => url.includes('/user_entitlements?')), false)
  }
})

test('desktop installer bytes require beta access', async (t) => {
  const asset = 'MechLab_0.1.1_x64-setup.exe'
  const url = `https://mechlab.test/api/desktop-updates/installers/${asset}`
  const keys = []
  t.mock.method(globalThis, 'fetch', async (input) => {
    const remote = String(input)
    if (remote.endsWith('/auth/v1/user')) return Response.json({ id: 'user-1' })
    if (remote.includes('/rest/v1/profiles?')) return Response.json([{ beta_access: true, account_status: 'active' }])
    throw new Error(`Unexpected request: ${remote}`)
  })
  const env = {
    SUPABASE_URL: 'https://supabase.example',
    SUPABASE_KEY_SECRET: 'server-only-test-secret',
    BETA_DOWNLOADS: { get: async (key) => {
      keys.push(key)
      return { body: new Blob(['installer']).stream(), size: 9 }
    } },
  }

  const denied = await worker.fetch(new Request(url), env)
  assert.equal(denied.status, 401)
  assert.deepEqual(keys, [])

  const approved = await worker.fetch(new Request(url, { headers: { Authorization: 'Bearer valid-session' } }), env)
  assert.equal(approved.status, 200)
  assert.equal(approved.headers.get('Content-Disposition'), `attachment; filename="${asset}"`)
  assert.deepEqual(keys, [`desktop-updates/installers/${asset}`])
  assert.equal(await approved.text(), 'installer')
})

test('approved beta download names the complete installer from release metadata', async (t) => {
  const asset = 'MechLab_0.1.1_x64-setup.exe'
  const objectKey = `desktop-updates/installers/${asset}`
  t.mock.method(globalThis, 'fetch', async (input) => {
    const remote = String(input)
    if (remote.endsWith('/auth/v1/user')) return Response.json({ id: 'user-1' })
    if (remote.includes('/rest/v1/profiles?')) return Response.json([{ beta_access: true, account_status: 'active' }])
    throw new Error(`Unexpected request: ${remote}`)
  })
  const env = {
    SUPABASE_URL: 'https://supabase.example',
    SUPABASE_KEY_SECRET: 'server-only-test-secret',
    BETA_DOWNLOADS: { get: async (key) => key === 'releases/current/latest.json'
      ? { text: async () => JSON.stringify({ version: '0.1.1', object_key: objectKey }) }
      : { body: new Blob(['installer']).stream(), size: 9 } },
  }
  const response = await worker.fetch(new Request(`https://mechlab.test${BETA_DOWNLOAD_URL}`, {
    headers: { Authorization: 'Bearer valid-session' },
  }), env)
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('Content-Disposition'), `attachment; filename="${asset}"`)
})

test('approved account gets a short-lived browser download link', async (t) => {
  const keys = []
  t.mock.method(globalThis, 'fetch', async (input) => {
    const remote = String(input)
    if (remote.endsWith('/auth/v1/user')) return Response.json({ id: 'user-1' })
    if (remote.includes('/rest/v1/profiles?')) return Response.json([{ beta_access: true, account_status: 'active' }])
    throw new Error(`Unexpected request: ${remote}`)
  })
  const env = {
    SUPABASE_URL: 'https://supabase.example',
    SUPABASE_KEY_SECRET: 'server-only-test-secret',
    BETA_DOWNLOADS: { get: async (key) => {
      keys.push(key)
      return key.endsWith('latest.json') ? null : { body: new Blob(['installer']).stream(), size: 9 }
    } },
  }
  const ticketResponse = await worker.fetch(new Request('https://mechlab.test/api/beta-download-ticket', {
    method: 'POST',
    headers: { Authorization: 'Bearer valid-session', Origin: 'https://mechlab.test' },
  }), env)
  assert.equal(ticketResponse.status, 200)
  assert.deepEqual(keys, [])
  const { url } = await ticketResponse.json()
  assert.ok(url.startsWith(`https://mechlab.test${BETA_DOWNLOAD_URL}?ticket=`))

  const download = await worker.fetch(new Request(url), env)
  assert.equal(download.status, 200)
  assert.equal(await download.text(), 'installer')

  const tampered = new URL(url)
  const ticket = tampered.searchParams.get('ticket')
  tampered.searchParams.set('ticket', `${ticket.slice(0, -1)}${ticket.endsWith('A') ? 'B' : 'A'}`)
  const denied = await worker.fetch(new Request(tampered), env)
  assert.equal(denied.status, 401)
})
