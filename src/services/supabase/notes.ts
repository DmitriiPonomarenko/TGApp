import { getSupabase } from '@/lib/supabase'
import type { Note } from '@/features/notes/types'

type Row = {
  id: string
  telegram_user_id: number
  title: string
  content: string
  reminder_at: string | null
  created_at: number
  updated_at: number
}

function rowToNote(r: Row): Note {
  return {
    id: r.id,
    title: r.title,
    content: r.content,
    reminderAt: r.reminder_at ?? undefined,
    createdAt: Number(r.created_at),
    updatedAt: Number(r.updated_at),
  }
}

export async function fetchNotes(telegramUserId: number): Promise<Note[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('notes')
    .select('id, title, content, reminder_at, created_at, updated_at')
    .eq('telegram_user_id', telegramUserId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('[Supabase] fetchNotes failed:', error.code, error.message)
    return []
  }
  return (data ?? []).map((r) => rowToNote(r as Row))
}

export async function addNote(
  telegramUserId: number,
  n: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Note | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const now = Math.floor(Date.now())
  const row = {
    telegram_user_id: telegramUserId,
    title: n.title,
    content: n.content,
    reminder_at: n.reminderAt ?? null,
    created_at: now,
    updated_at: now,
  }

  const { data, error } = await supabase
    .from('notes')
    .insert(row)
    .select('id, title, content, reminder_at, created_at, updated_at')
    .single()

  if (error) {
    console.error('[Supabase] addNote failed:', error.code, error.message, error.details)
    return null
  }
  return rowToNote({ ...data, telegram_user_id: telegramUserId } as Row)
}

export async function updateNote(
  telegramUserId: number,
  id: string,
  patch: Partial<Pick<Note, 'title' | 'content' | 'reminderAt'>>
): Promise<boolean> {
  const supabase = getSupabase()
  if (!supabase) return false

  const row: Record<string, unknown> = { updated_at: Math.floor(Date.now()) }
  if (patch.title !== undefined) row.title = patch.title
  if (patch.content !== undefined) row.content = patch.content
  if (patch.reminderAt !== undefined) row.reminder_at = patch.reminderAt ?? null

  const { error } = await supabase
    .from('notes')
    .update(row)
    .eq('id', id)
    .eq('telegram_user_id', telegramUserId)

  if (error) {
    console.error('[Supabase] updateNote failed:', error.code, error.message)
    return false
  }
  return true
}

export async function removeNote(
  telegramUserId: number,
  id: string
): Promise<boolean> {
  const supabase = getSupabase()
  if (!supabase) return false

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('telegram_user_id', telegramUserId)

  if (error) {
    console.error('[Supabase] removeNote failed:', error.code, error.message)
    return false
  }
  return true
}
