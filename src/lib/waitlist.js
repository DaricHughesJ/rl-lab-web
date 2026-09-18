import { getStoredUtms } from './utm'
import { supabase } from './supabase'

export function track(event, props = {}) {
  const payload = { event, ...props, ts: Date.now(), path: window.location.pathname }
  try {
    window.dispatchEvent(new CustomEvent('mechlab:analytics', { detail: payload }))
  } catch {
    /* ignore */
  }
  if (import.meta.env.DEV) console.info('[mechlab]', payload)
}

export async function submitWaitlist(form) {
  const utms = getStoredUtms()
  const row = {
    email: String(form.email || '').trim().toLowerCase(),
    display_name: String(form.display_name || '').trim() || null,
    rank_bucket: form.rank_bucket || null,
    mechanic_focus: form.mechanic_focus || null,
    discord: String(form.discord || '').trim() || null,
    heard_from: form.heard_from || null,
    source: 'waitlist',
    ...utms,
    created_at: new Date().toISOString(),
  }

  if (!row.email || !row.email.includes('@')) {
    throw new Error('Enter a valid email.')
  }

  track('waitlist_submit', { has_optional: Boolean(row.display_name || row.rank_bucket || row.mechanic_focus) })

  let remote = null
  if (supabase) {
    const { data, error } = await supabase.from('waitlist_signups').insert(row).select('id').maybeSingle()
    if (!error) remote = data
  }

  const local = { ...row, id: remote?.id || `local-${Date.now()}`, saved_at: new Date().toISOString() }
  try {
    const prev = JSON.parse(localStorage.getItem('mechlab_waitlist') || '[]')
    prev.unshift(local)
    localStorage.setItem('mechlab_waitlist', JSON.stringify(prev.slice(0, 20)))
  } catch {
    /* ignore */
  }

  return local
}
