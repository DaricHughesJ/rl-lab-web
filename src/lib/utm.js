const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
const STORAGE_KEY = 'mechlab_utm'

export function captureUtms(search = window.location.search) {
  const params = new URLSearchParams(search)
  const found = {}
  for (const key of UTM_KEYS) {
    const value = params.get(key)
    if (value) found[key] = value
  }
  if (Object.keys(found).length) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found))
    } catch {
      /* ignore */
    }
  }
  return getStoredUtms()
}

export function getStoredUtms() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function withUtms(href) {
  const utms = getStoredUtms()
  const keys = Object.keys(utms)
  if (!keys.length) return href
  const url = new URL(href, window.location.origin)
  for (const key of keys) url.searchParams.set(key, utms[key])
  return `${url.pathname}${url.search}${url.hash}`
}
