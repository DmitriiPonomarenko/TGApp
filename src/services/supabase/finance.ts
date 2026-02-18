import { getSupabase } from '@/lib/supabase'
import type { Transaction } from '@/features/finance/types'

type Row = {
  id: string
  telegram_user_id: number
  amount: number
  category: string
  type: 'income' | 'expense'
  date: string
  comment: string | null
  created_at: number
}

function rowToTransaction(r: Row): Transaction {
  return {
    id: r.id,
    amount: Number(r.amount),
    category: r.category,
    type: r.type,
    date: r.date,
    comment: r.comment ?? undefined,
    createdAt: Number(r.created_at),
  }
}

export async function fetchTransactions(
  telegramUserId: number
): Promise<Transaction[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('transactions')
    .select('id, amount, category, type, date, comment, created_at')
    .eq('telegram_user_id', telegramUserId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[Supabase] fetchTransactions failed:', error.code, error.message)
    return []
  }
  return (data ?? []).map((r) => rowToTransaction(r as Row))
}

export async function addTransaction(
  telegramUserId: number,
  t: Omit<Transaction, 'id' | 'createdAt'>
): Promise<Transaction | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const row = {
    telegram_user_id: telegramUserId,
    amount: t.amount,
    category: t.category,
    type: t.type,
    date: t.date,
    comment: t.comment ?? null,
    created_at: Math.floor(Date.now()), // целое число для bigint в Postgres
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert(row)
    .select('id, amount, category, type, date, comment, created_at')
    .single()

  if (error) {
    console.error('[Supabase] addTransaction failed:', error.code, error.message, error.details)
    return null
  }
  return rowToTransaction({ ...data, telegram_user_id: telegramUserId } as Row)
}

export async function removeTransaction(
  telegramUserId: number,
  id: string
): Promise<boolean> {
  const supabase = getSupabase()
  if (!supabase) return false

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('telegram_user_id', telegramUserId)

  if (error) {
    console.error('[Supabase] removeTransaction', error)
    return false
  }
  return true
}
