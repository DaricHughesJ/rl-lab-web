import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(url && publishableKey)
export const supabase = isSupabaseConfigured
  ? createClient(url, publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null

function requireSupabase() {
  if (!supabase) throw new Error('Account services are not configured yet.')
  return supabase
}

export async function signUpForBeta({ name, email, password, rank, platform }) {
  const client = requireSupabase()
  return client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: { display_name: name, rocket_league_rank: rank, platform, beta_status: 'requested' },
    },
  })
}

export async function signIn({ email, password }) {
  return requireSupabase().auth.signInWithPassword({ email, password })
}

export async function requestPasswordReset(email) {
  return requireSupabase().auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/?recovery=1`,
  })
}

export async function changePassword(password) {
  return requireSupabase().auth.updateUser({ password })
}

export async function getBetaProfile() {
  const { data, error } = await requireSupabase()
    .from('profiles')
    .select('display_name, rank_bucket, beta_access')
    .single()
  if (error) throw error
  return data
}

export async function updateProfile({ display_name, rank_bucket }) {
  const client = requireSupabase()
  const { data: auth } = await client.auth.getUser()
  if (!auth.user) throw new Error('Your session expired. Sign in again.')
  const { data, error } = await client
    .from('profiles')
    .upsert({ user_id: auth.user.id, display_name: display_name.trim(), rank_bucket, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    .select('display_name, rank_bucket, beta_access')
    .single()
  if (error) throw error
  return data
}

export async function getUserSettings() {
  const client = requireSupabase()
  const { data: auth } = await client.auth.getUser()
  if (!auth.user) throw new Error('Your session expired. Sign in again.')
  const { data, error } = await client
    .from('user_settings')
    .select('cloud_progress_sync, usage_analytics, contribute_training_data')
    .eq('user_id', auth.user.id)
    .maybeSingle()
  if (error) throw error
  return data || { cloud_progress_sync: true, usage_analytics: false, contribute_training_data: false }
}

export async function updateUserSettings(settings) {
  const client = requireSupabase()
  const { data: auth } = await client.auth.getUser()
  if (!auth.user) throw new Error('Your session expired. Sign in again.')
  const payload = { user_id: auth.user.id, ...settings, updated_at: new Date().toISOString() }
  const { data, error } = await client
    .from('user_settings')
    .upsert(payload, { onConflict: 'user_id' })
    .select('cloud_progress_sync, usage_analytics, contribute_training_data')
    .single()
  if (error) throw error
  return data
}

export async function getDashboardData() {
  const client = requireSupabase()
  const [sessionsResult, progressResult] = await Promise.all([
    client
      .from('sessions')
      .select('id, recorded_at, duration_seconds, total_attempts, summary')
      .order('recorded_at', { ascending: false })
      .limit(50),
    client
      .from('mechanic_progress')
      .select('id, session_id, mechanic, attempts, mean_score, consistency, best_score, trend, metrics, created_at')
      .order('created_at', { ascending: false })
      .limit(250),
  ])
  if (sessionsResult.error) throw sessionsResult.error
  if (progressResult.error) throw progressResult.error
  return { sessions: sessionsResult.data || [], progress: progressResult.data || [] }
}
