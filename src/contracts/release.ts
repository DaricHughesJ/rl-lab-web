export interface ReleaseMetadata {
  version: string
  tag: string | null
  sha256: string | null
  size: number | null
  commit: string | null
  build_run_id: string | number | null
  published_at: string | null
  object_key?: string | null
}

export interface LatestReleaseResponse {
  version: string
  tag: string | null
  sha256: string | null
  size: number | null
  commit: string | null
  build_run_id: string | number | null
  published_at: string | null
  url: string
  notes: string
}

export interface ApiErrorResponse {
  error: string
  code?: string
  request_id?: string
}

export const RELEASE_CONTRACT_VERSION = 1 as const
