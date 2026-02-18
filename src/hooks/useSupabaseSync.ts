import { useEffect, useRef } from 'react'
import { isSupabaseConfigured } from '@/lib/supabase'
import * as financeApi from '@/services/supabase/finance'
import * as notesApi from '@/services/supabase/notes'
import { useFinanceStore } from '@/store/financeStore'
import { useNotesStore } from '@/store/notesStore'

/**
 * Загружает данные из Supabase в store при монтировании.
 * Вызывать один раз в корне (App), передавая telegram user id.
 */
export function useSupabaseSync(telegramUserId: number | undefined) {
  const financeSet = useFinanceStore((s) => s.setTransactions)
  const notesSet = useNotesStore((s) => s.setNotes)
  const didSync = useRef(false)

  useEffect(() => {
    if (!isSupabaseConfigured() || telegramUserId == null || didSync.current) return
    didSync.current = true

    const load = async () => {
      const [transactions, notes] = await Promise.all([
        financeApi.fetchTransactions(telegramUserId),
        notesApi.fetchNotes(telegramUserId),
      ])
      financeSet(transactions)
      notesSet(notes)
    }
    load()
  }, [telegramUserId, financeSet, notesSet])
}
