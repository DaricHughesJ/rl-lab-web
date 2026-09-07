// Application-facing contracts for the current web migration.
// These are not a substitute for generated Supabase database types. W5 replaces
// database-row assumptions with generated schema types and maps them into these
// domain/view contracts where a stable UI shape is still useful.

export interface BetaSignUpInput {
  name: string
  email: string
  password: string
  rank: string
  platform: string
}

export interface SignInInput {
  email: string
  password: string
}

export interface BetaProfile {
  display_name: string | null
  rank_bucket: string | null
  beta_access: boolean
}

export interface ProfileUpdateInput {
  display_name: string
  rank_bucket: string
}

export interface UserSettings {
  cloud_progress_sync: boolean
  usage_analytics: boolean
  contribute_training_data: boolean
}

export interface SessionSummary {
  mode?: string
  source?: string
  [key: string]: unknown
}

export interface DashboardSession {
  id: string
  recorded_at: string
  duration_seconds: number | null
  total_attempts: number | null
  summary: SessionSummary | null
}

export interface MechanicProgress {
  id: string
  session_id: string | null
  mechanic: string
  attempts: number
  mean_score: number
  consistency: number | null
  best_score: number
  trend: number | null
  metrics: Record<string, unknown> | null
  created_at: string
}

export interface DashboardData {
  sessions: DashboardSession[]
  progress: MechanicProgress[]
}

export const DEFAULT_USER_SETTINGS: Readonly<UserSettings> = Object.freeze({
  cloud_progress_sync: true,
  usage_analytics: false,
  contribute_training_data: false,
})
