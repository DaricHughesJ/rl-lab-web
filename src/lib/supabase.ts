import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import {
  DEFAULT_USER_SETTINGS,
  type BetaProfile,
  type BetaSignUpInput,
  type DashboardData,
  type DashboardSession,
  type MechanicProgress,
  type ProfileUpdateInput,
  type SignInInput,
  type UserSettings,
} from '../contracts/account'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = url && publishableKey
  ? createClient(url, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export const isSupabaseConfigured = supabase !== null

function requireSupabase(): SupabaseClient {
  if (!supabase) throw new Error('Account services are not configured yet.')
  return supabase
}

export async function signUpForBeta({
  name,
  email,
  password,
  rank,
  platform,
}: BetaSignUpInput) {
  const client = requireSupabase()
  return client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        display_name: name,
        rocket_league_rank: rank,
        platform,
        beta_status: 'requested',
      },
    },
  })
}

export async function signIn({ email, password }: SignInInput) {
  return requireSupabase().auth.signInWithPassword({ email, password })
}

export async function requestPasswordReset(email: string) {
  return requireSupabase().auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/?recovery=1`,
  })
}

export async function changePassword(password: string) {
  return requireSupabase().auth.updateUser({ password })
}

export async function getBetaProfile(): Promise<BetaProfile> {
  const { data, error } = await requireSupabase()
    .from('profiles')
    .select('display_name, rank_bucket, beta_access')
    .single()

  if (error) throw error
  return data as BetaProfile
}

export async function updateProfile({
  display_name,
  rank_bucket,
}: ProfileUpdateInput): Promise<BetaProfile> {
  const client = requireSupabase()
  const { data: auth } = await client.auth.getUser()
  if (!auth.user) throw new Error('Your session expired. Sign in again.')

  const { data, error } = await client
    .from('profiles')
    .upsert(
      {
        user_id: auth.user.id,
        display_name: display_name.trim(),
        rank_bucket,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
    .select('display_name, rank_bucket, beta_access')
    .single()

  if (error) throw error
  return data as BetaProfile
}

export async function getUserSettings(): Promise<UserSettings> {
  const client = requireSupabase()
  const { data: auth } = await client.auth.getUser()
  if (!auth.user) throw new Error('Your session expired. Sign in again.')

  const { data, error } = await client
    .from('user_settings')
    .select('cloud_progress_sync, usage_analytics, contribute_training_data')
    .eq('user_id', auth.user.id)
    .maybeSingle()

  if (error) throw error
  return data ? (data as UserSettings) : { ...DEFAULT_USER_SETTINGS }
}

export async function updateUserSettings(settings: UserSettings): Promise<UserSettings> {
  const client = requireSupabase()
  const { data: auth } = await client.auth.getUser()
  if (!auth.user) throw new Error('Your session expired. Sign in again.')

  const payload = {
    user_id: auth.user.id,
    ...settings,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await client
    .from('user_settings')
    .upsert(payload, { onConflict: 'user_id' })
    .select('cloud_progress_sync, usage_analytics, contribute_training_data')
    .single()

  if (error) throw error
  return data as UserSettings
}

export async function getDashboardData(): Promise<DashboardData> {
  const client = requireSupabase()
  const [sessionsResult, progressResult] = await Promise.all([
    client
      .from('sessions')
      .select('id, recorded_at, duration_seconds, total_attempts, summary')
      .order('recorded_at', { ascending: false })
      .limit(50),
    client
      .from('mechanic_progress')
      .select(
        'id, session_id, mechanic, attempts, mean_score, consistency, best_score, trend, metrics, created_at',
      )
      .order('created_at', { ascending: false })
      .limit(250),
  ])

  if (sessionsResult.error) throw sessionsResult.error
  if (progressResult.error) throw progressResult.error

  return {
    sessions: (sessionsResult.data ?? []) as DashboardSession[],
    progress: (progressResult.data ?? []) as MechanicProgress[],
  }
}
