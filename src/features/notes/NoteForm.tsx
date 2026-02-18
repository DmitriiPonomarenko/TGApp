import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { Note } from './types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { scheduleReminder, cancelReminder } from './api/reminders'
import { useTelegram, useUserId, useNotesActions } from '@/hooks'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editNote: Note | null
}

export function NoteForm({ open, onOpenChange, editNote }: Props) {
  const { haptic } = useTelegram()
  const userId = useUserId()
  const { addNote, updateNote } = useNotesActions(userId)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [reminderAt, setReminderAt] = useState('')

  const isEditing = !!editNote

  const reset = () => {
    setTitle('')
    setContent('')
    setReminderAt('')
  }

  useEffect(() => {
    if (open) {
      if (editNote) {
        setTitle(editNote.title)
        setContent(editNote.content)
        setReminderAt(
          editNote.reminderAt
            ? new Date(editNote.reminderAt).toISOString().slice(0, 16)
            : ''
        )
      } else {
        reset()
      }
    }
  }, [open, editNote])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedTitle = title.trim() || 'Без названия'
    const trimmedContent = content.trim()

    if (isEditing && editNote) {
      const hadReminder = editNote.reminderAt
      const newReminderAt = reminderAt
        ? new Date(reminderAt).toISOString()
        : undefined

      await updateNote(editNote.id, {
        title: trimmedTitle,
        content: trimmedContent,
        reminderAt: newReminderAt,
      })

      if (hadReminder && !newReminderAt) {
        await cancelReminder(editNote.id)
      }
      if (newReminderAt) {
        await scheduleReminder(editNote.id, newReminderAt, {
          title: trimmedTitle,
          content: trimmedContent,
        })
      }
      haptic.notification('success')
    } else {
      const reminderAtIso = reminderAt
        ? new Date(reminderAt).toISOString()
        : undefined
      const newNote = await addNote({
        title: trimmedTitle,
        content: trimmedContent,
        reminderAt: reminderAtIso,
      })
      if (newNote && reminderAtIso) {
        await scheduleReminder(newNote.id, reminderAtIso, {
          title: trimmedTitle,
          content: trimmedContent,
        })
      }
      haptic.notification('success')
    }

    onOpenChange(false)
    reset()
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-tg-bg-secondary bg-tg-bg p-4 shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-tg-text">
              {isEditing ? 'Редактировать заметку' : 'Новая заметка'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Закрыть">
                <X className="h-5 w-5" />
              </Button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Название"
              type="text"
              placeholder="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-tg-text">
                Текст (необязательно)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Содержание заметки"
                rows={4}
                className="flex w-full rounded-xl border border-tg-bg-secondary bg-tg-bg-secondary px-4 py-3 text-base text-tg-text placeholder:text-tg-hint focus:border-tg-button focus:outline-none focus:ring-2 focus:ring-tg-button/20 resize-none"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-tg-text">
                Напоминание (необязательно)
              </label>
              <input
                type="datetime-local"
                value={reminderAt}
                onChange={(e) => setReminderAt(e.target.value)}
                className="flex h-12 w-full rounded-xl border border-tg-bg-secondary bg-tg-bg-secondary px-4 text-base text-tg-text focus:border-tg-button focus:outline-none focus:ring-2 focus:ring-tg-button/20"
              />
              <p className="text-xs text-tg-hint">
                В нужное время бот отправит вам уведомление в Telegram.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Отмена
              </Button>
              <Button type="submit" className="flex-1">
                {isEditing ? 'Сохранить' : 'Создать'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
