const DOWNLOAD_PATH = '/api/beta-download'
const BETA_OBJECT_KEY = 'releases/v0.2.0-beta.1/MechLab.exe'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname !== DOWNLOAD_PATH) return env.ASSETS.fetch(request)
    if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405, { Allow: 'GET' })

    const token = bearerToken(request.headers.get('Authorization'))
    if (!token) return json({ error: 'Sign in required' }, 401)

    const user = await supabaseJson(`${env.SUPABASE_URL}/auth/v1/user`, env, token)
    if (!user?.id) return json({ error: 'Invalid or expired session' }, 401)

    const profiles = await supabaseJson(
      `${env.SUPABASE_URL}/rest/v1/profiles?select=beta_access&user_id=eq.${encodeURIComponent(user.id)}&limit=1`,
      env,
      token,
    )
    if (!Array.isArray(profiles) || profiles[0]?.beta_access !== true) {
      return json({ error: 'Beta access required' }, 403)
    }

    const object = await env.BETA_DOWNLOADS.get(BETA_OBJECT_KEY)
    if (!object) return json({ error: 'Beta build unavailable' }, 503)

    return new Response(object.body, {
      headers: {
        'Content-Type': 'application/vnd.microsoft.portable-executable',
        'Content-Disposition': 'attachment; filename="MechLab.exe"',
        'Content-Length': String(object.size),
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  },
}

function bearerToken(value) {
  const match = /^Bearer\s+(.+)$/i.exec(value || '')
  return match?.[1] || null
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
