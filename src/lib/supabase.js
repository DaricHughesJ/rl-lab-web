import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(url && publishableKey)
export const supabase = isSupabaseConfigured
  ? createClient(url, publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null

export async function signUpForBeta({ name, email, password, rank, platform }) {
  if (!supabase) throw new Error('Account services are not configured yet.')
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: { display_name: name, rocket_league_rank: rank, platform, beta_status: 'requested' },
    },
  })
}

export async function signIn({ email, password }) {
  if (!supabase) throw new Error('Account services are not configured yet.')
  return supabase.auth.signInWithPassword({ email, password })
}

export async function getBetaProfile() {
  if (!supabase) throw new Error('Account services are not configured yet.')
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, rank_bucket, beta_access')
    .single()
  if (error) throw error
  return data
}
