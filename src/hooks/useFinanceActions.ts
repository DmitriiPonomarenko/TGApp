import { useCallback } from 'react'
import { isSupabaseConfigured } from '@/lib/supabase'
import * as financeApi from '@/services/supabase/finance'
import { useFinanceStore } from '@/store/financeStore'
import type { Transaction } from '@/features/finance/types'

/**
 * Возвращает addTransaction и removeTransaction.
 * Если настроен Supabase и передан telegramUserId — мутации идут в Supabase и затем в store.
 * Иначе — только в store (LocalStorage через persist).
 */
export function useFinanceActions(telegramUserId: number | undefined) {
  const addLocal = useFinanceStore((s) => s.addTransaction)
  const addFromServer = useFinanceStore((s) => s.addTransactionFromServer)
  const removeLocal = useFinanceStore((s) => s.removeTransaction)

  const addTransaction = useCallback(
    async (t: Omit<Transaction, 'id' | 'createdAt'>) => {
      if (isSupabaseConfigured() && telegramUserId != null) {
        const created = await financeApi.addTransaction(telegramUserId, t)
        if (created) addFromServer(created)
      } else {
        addLocal(t)
      }
    },
    [telegramUserId, addLocal, addFromServer]
  )

  const removeTransaction = useCallback(
    async (id: string) => {
      if (isSupabaseConfigured() && telegramUserId != null) {
        const ok = await financeApi.removeTransaction(telegramUserId, id)
        if (ok) removeLocal(id)
      } else {
        removeLocal(id)
      }
    },
    [telegramUserId, removeLocal]
  )

  return { addTransaction, removeTransaction }
}
