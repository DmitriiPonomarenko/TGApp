import { useCallback } from 'react'
import { isSupabaseConfigured } from '@/lib/supabase'
import * as notesApi from '@/services/supabase/notes'
import { useNotesStore } from '@/store/notesStore'
import type { Note } from '@/features/notes/types'

/**
 * Возвращает addNote, updateNote, removeNote.
 * Если настроен Supabase и передан telegramUserId — мутации идут в Supabase и затем в store.
 */
export function useNotesActions(telegramUserId: number | undefined) {
  const addLocal = useNotesStore((s) => s.addNote)
  const addFromServer = useNotesStore((s) => s.addNoteFromServer)
  const updateLocal = useNotesStore((s) => s.updateNote)
  const removeLocal = useNotesStore((s) => s.removeNote)

  const addNote = useCallback(
    async (n: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (isSupabaseConfigured() && telegramUserId != null) {
        const created = await notesApi.addNote(telegramUserId, n)
        if (created) {
          addFromServer(created)
          return created
        }
        return addLocal(n) // при ошибке API сохраняем локально
      }
      return addLocal(n)
    },
    [telegramUserId, addLocal, addFromServer]
  )

  const updateNote = useCallback(
    async (
      id: string,
      patch: Partial<Pick<Note, 'title' | 'content' | 'reminderAt'>>
    ) => {
      if (isSupabaseConfigured() && telegramUserId != null) {
        await notesApi.updateNote(telegramUserId, id, patch)
        updateLocal(id, patch) // обновляем UI в любом случае; при ошибке API хотя бы локально
      } else {
        updateLocal(id, patch)
      }
    },
    [telegramUserId, updateLocal]
  )

  const removeNote = useCallback(
    async (id: string) => {
      if (isSupabaseConfigured() && telegramUserId != null) {
        await notesApi.removeNote(telegramUserId, id)
        removeLocal(id) // при ошибке API всё равно убираем из списка
      } else {
        removeLocal(id)
      }
    },
    [telegramUserId, removeLocal]
  )

  return { addNote, updateNote, removeNote }
}
