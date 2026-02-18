import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let client: SupabaseClient | null = null

if (url && anonKey) {
  client = createClient(url, anonKey)
}

export function getSupabase(): SupabaseClient | null {
  return client
}

export const isSupabaseConfigured = (): boolean => !!client

const ANON_USER_KEY = 'tg_app_anon_user_id'

/**
 * Для браузера (без Telegram) — один раз генерируем и сохраняем id,
 * чтобы данные всё равно писались в Supabase. Используем отрицательное число,
 * чтобы не пересекаться с реальными Telegram user id.
 */
export function getOrCreateAnonUserId(): number {
  if (typeof window === 'undefined') return -1
  let id = localStorage.getItem(ANON_USER_KEY)
  if (!id) {
    id = String(-Math.floor(Math.random() * 1e9))
    localStorage.setItem(ANON_USER_KEY, id)
  }
  return parseInt(id, 10)
}
