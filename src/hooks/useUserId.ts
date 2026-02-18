import { useMemo } from 'react'
import { isSupabaseConfigured, getOrCreateAnonUserId } from '@/lib/supabase'
import { useTelegram } from './useTelegram'

/**
 * Возвращает id пользователя для Supabase: из Telegram или анонимный (в браузере).
 * Если Supabase не настроен — только Telegram id (в браузере будет undefined).
 */
export function useUserId(): number | undefined {
  const { webApp } = useTelegram()
  return useMemo(() => {
    const telegramId = webApp.initDataUnsafe?.user?.id
    if (telegramId != null) return telegramId
    if (isSupabaseConfigured()) return getOrCreateAnonUserId()
    return undefined
  }, [webApp.initDataUnsafe?.user?.id])
}
