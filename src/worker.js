import {
  BETA_DOWNLOAD_URL,
  BETA_LATEST_URL,
  BETA_METADATA_KEY,
  BETA_OBJECT_KEY,
  BETA_RELEASE_VERSION,
  BETA_VERSION,
} from './lib/release.js'

const UPDATE_MANIFEST_PATH = '/api/desktop-updates/manifest-v1.json'
const UPDATE_INSTALLER_PREFIX = '/api/desktop-updates/installers/'
const UPDATE_MANIFEST_KEY = 'desktop-updates/manifest-v1.json'
const INSTALLER_NAME = /^MechLab_\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?_x64-setup\.exe$/
const BETA_DOWNLOAD_TICKET_PATH = '/api/beta-download-ticket'
const DOWNLOAD_TICKET_LIFETIME_SECONDS = 120

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/account/activate') {
      return activateMechLabAccount(request, env, url)
    }

    if (url.pathname === BETA_DOWNLOAD_TICKET_PATH) {
      if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, { Allow: 'POST' })
      const origin = request.headers.get('Origin')
      if (origin && origin !== url.origin) return json({ error: 'Request rejected' }, 403)
      const denial = await betaAccessDenial(request, env)
      if (denial) return denial
      if (!env.SUPABASE_KEY_SECRET) return json({ error: 'Download unavailable' }, 503)
      const ticket = await createDownloadTicket(env)
      return json({ url: `${url.origin}${BETA_DOWNLOAD_URL}?ticket=${encodeURIComponent(ticket)}` }, 200)
    }

    if (url.pathname === BETA_LATEST_URL) {
      if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405, { Allow: 'GET' })
      const release = await releaseMetadata(env)
      const version = release?.version || BETA_RELEASE_VERSION
      const displayVersion = release?.version ? `MechLab ${release.version}` : BETA_VERSION
      const objectKey = safeReleaseObjectKey(release?.object_key) || BETA_OBJECT_KEY
      const fileName = objectKey.split('/').at(-1)
      return json(
        {
          version,
          file_name: fileName,
          tag: release?.tag || null,
          sha256: release?.sha256 || null,
          size: release?.size || null,
          commit: release?.commit || null,
          build_run_id: release?.build_run_id || null,
          published_at: release?.published_at || null,
          url: `${url.origin}/`,
          notes: `${displayVersion} is available. Sign in with your approved MechLab beta account to download ${fileName}.`,
        },
        200,
        { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=60' },
      )
    }

    const isUpdateInstaller = url.pathname.startsWith(UPDATE_INSTALLER_PREFIX)
    if (url.pathname !== BETA_DOWNLOAD_URL && url.pathname !== UPDATE_MANIFEST_PATH && !isUpdateInstaller) {
      return env.ASSETS.fetch(request)
    }
    if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405, { Allow: 'GET' })

    if (url.pathname === UPDATE_MANIFEST_PATH) {
      const manifest = await env.BETA_DOWNLOADS.get(UPDATE_MANIFEST_KEY)
      if (!manifest) return json({ error: 'Desktop updates unavailable' }, 503)
      return new Response(manifest.body, { headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      } })
    }

    if (url.pathname === BETA_DOWNLOAD_URL && url.searchParams.has('ticket')) {
      if (!env.SUPABASE_KEY_SECRET || !await validDownloadTicket(url.searchParams.get('ticket'), env)) {
        return json({ error: 'Download link expired. Please try again.' }, 401)
      }
    } else {
      const denial = await betaAccessDenial(request, env)
      if (denial) return denial
    }

    if (isUpdateInstaller) {
      const fileName = url.pathname.slice(UPDATE_INSTALLER_PREFIX.length)
      if (!INSTALLER_NAME.test(fileName)) return json({ error: 'Installer not found' }, 404)
      const installer = await env.BETA_DOWNLOADS.get(`desktop-updates/installers/${fileName}`)
      if (!installer) return json({ error: 'Installer not found' }, 404)
      return new Response(installer.body, { headers: {
        'Content-Type': 'application/vnd.microsoft.portable-executable',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': String(installer.size),
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      } })
    }

    const release = await releaseMetadata(env)
    const objectKey = safeReleaseObjectKey(release?.object_key) || BETA_OBJECT_KEY
    const object = await env.BETA_DOWNLOADS.get(objectKey)
    if (!object) return json({ error: 'Beta build unavailable' }, 503)
    const fileName = objectKey.split('/').at(-1)

    const headers = {
      'Content-Type': 'application/vnd.microsoft.portable-executable',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': String(object.size),
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
    }
    if (release?.version) headers['X-MechLab-Version'] = release.version
    if (release?.sha256) headers['X-MechLab-SHA256'] = release.sha256
    if (release?.commit) headers['X-MechLab-Commit'] = release.commit

    return new Response(object.body, { headers })
  },
}

async function ticketKey(env) {
  const material = new TextEncoder().encode(`mechlab-download-ticket-v1:${env.SUPABASE_KEY_SECRET}`)
  const derived = await crypto.subtle.digest('SHA-256', material)
  return crypto.subtle.importKey('raw', derived, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

function base64url(bytes) {
  return btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

function fromBase64url(value) {
  const padded = value.replaceAll('-', '+').replaceAll('_', '/')
  return Uint8Array.from(atob(padded), character => character.charCodeAt(0))
}

async function createDownloadTicket(env) {
  const expires = Math.floor(Date.now() / 1000) + DOWNLOAD_TICKET_LIFETIME_SECONDS
  const nonce = base64url(crypto.getRandomValues(new Uint8Array(16)))
  const payload = `v1.${expires}.${nonce}`
  const signature = await crypto.subtle.sign('HMAC', await ticketKey(env), new TextEncoder().encode(payload))
  return `${payload}.${base64url(new Uint8Array(signature))}`
}

async function validDownloadTicket(ticket, env) {
  if (typeof ticket !== 'string' || ticket.length > 200) return false
  const match = /^(v1\.\d{10}\.[A-Za-z0-9_-]{22})\.([A-Za-z0-9_-]{43})$/.exec(ticket)
  if (!match) return false
  const expires = Number(match[1].split('.')[1])
  const now = Math.floor(Date.now() / 1000)
  if (expires < now || expires > now + DOWNLOAD_TICKET_LIFETIME_SECONDS) return false
  try {
    return await crypto.subtle.verify('HMAC', await ticketKey(env), fromBase64url(match[2]), new TextEncoder().encode(match[1]))
  } catch {
    return false
  }
}

async function betaAccessDenial(request, env) {
    const token = bearerToken(request.headers.get('Authorization'))
    if (!token) return json({ error: 'Sign in required' }, 401)

    const user = await supabaseJson(`${env.SUPABASE_URL}/auth/v1/user`, env, token)
    if (!user?.id) return json({ error: 'Invalid or expired session' }, 401)

    const profiles = await supabaseJson(
      `${env.SUPABASE_URL}/rest/v1/profiles?select=beta_access,account_status&user_id=eq.${encodeURIComponent(user.id)}&limit=1`,
      env,
      token,
    )
    const profile = Array.isArray(profiles) ? profiles[0] : null
    if (!profile || (profile.account_status && profile.account_status !== 'active')) {
      return json({ error: 'Account is not active' }, 403)
    }
    let hasAccess = profile.beta_access === true
    if (!hasAccess) {
      const entitlements = await supabaseJson(
        `${env.SUPABASE_URL}/rest/v1/user_entitlements?select=expires_at&user_id=eq.${encodeURIComponent(user.id)}&entitlement_key=eq.trainer_access&revoked_at=is.null&limit=1`,
        env,
        token,
      )
      const entitlement = Array.isArray(entitlements) ? entitlements[0] : null
      hasAccess = Boolean(entitlement && (!entitlement.expires_at || new Date(entitlement.expires_at) > new Date()))
    }
    if (!hasAccess) {
      return json({ error: 'Beta access required' }, 403)
    }
    return null
}

async function activateMechLabAccount(request, env, url) {
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, { Allow: 'POST' })

  const origin = request.headers.get('Origin')
  if (origin && origin !== url.origin) return json({ error: 'request_rejected' }, 403)
  if (!env.SUPABASE_URL || !env.SUPABASE_KEY_SECRET) return json({ error: 'temporarily_unavailable' }, 503)

  const token = bearerToken(request.headers.get('Authorization'))
  if (!token) return json({ error: 'sign_in_required' }, 401)

  let payload
  try {
    const body = await request.text()
    if (body.length > 1024) return json({ error: 'invalid_request' }, 400)
    payload = JSON.parse(body)
  } catch {
    return json({ error: 'invalid_request' }, 400)
  }

  const key = typeof payload?.key === 'string' ? payload.key.trim() : ''
  if (key.length < 6 || key.length > 256) return json({ error: 'invalid' }, 400)

  const user = await supabaseJson(`${env.SUPABASE_URL}/auth/v1/user`, env, token)
  if (!user?.id) return json({ error: 'sign_in_required' }, 401)

  let result
  try {
    const response = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/redeem_mechlab_activation_key_self`, {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_KEY_SECRET,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_key: key }),
    })
    if (!response.ok) {
      const rpcError = await response.json().catch(() => ({}))
      console.error('Activation RPC failed', response.status, rpcError.code || 'unknown')
      return json({ error: 'temporarily_unavailable' }, 503)
    }
    result = await response.json()
  } catch {
    return json({ error: 'temporarily_unavailable' }, 503)
  }

  const status = typeof result === 'string' ? result : result?.redeem_mechlab_activation_key_self
  if (status === 'activated' || status === 'already_activated') {
    return json({ activated: true }, 200)
  }
  if (status === 'expired') return json({ error: 'expired' }, 410)
  if (status === 'already_used') return json({ error: 'already_used' }, 409)
  if (status === 'invalid') return json({ error: 'invalid' }, 400)
  return json({ error: 'temporarily_unavailable' }, 503)
}

function bearerToken(value) {
  const match = /^Bearer\s+(.+)$/i.exec(value || '')
  return match?.[1] || null
}

function safeReleaseObjectKey(value) {
  if (typeof value !== 'string') return null
  if (/^releases\/v\d+\.\d+\.\d+-beta\.\d+\/MechLab\.exe$/.test(value)) return value
  if (/^releases\/v(\d+\.\d+\.\d+)-beta\.\d+\/MechLab_\1_x64-setup\.exe$/.test(value)) return value
  if (/^desktop-updates\/installers\/MechLab_\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?_x64-setup\.exe$/.test(value)) return value
  return null
}

async function releaseMetadata(env) {
  const object = await env.BETA_DOWNLOADS.get(BETA_METADATA_KEY)
  if (!object) return null
  try {
    return JSON.parse(await object.text())
  } catch {
    return null
  }
}

async function supabaseJson(url, env, token) {
  const response = await fetch(url, {
    headers: { apikey: env.SUPABASE_KEY_SECRET, Authorization: `Bearer ${token}` },
  })
  if (!response.ok) return null
  return response.json()
}

function json(body, status, headers = {}) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } })
}
