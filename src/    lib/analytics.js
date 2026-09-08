import { supabase } from './supabase'

export function getAnonymousId() {
  const key = 'yao_anonymous_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

export async function trackEvent(eventName, metadata = {}) {
  const payload = {
    anonymous_id: getAnonymousId(),
    event_name: eventName,
    feature_key: metadata.feature_key || null,
    page_path: location.pathname,
    metadata,
    created_at: new Date().toISOString()
  }
  if (!supabase) {
    console.info('[YAO analytics]', payload)
    return
  }
  await supabase.from('analytics_events').insert(payload)
}
