import { motion } from 'framer-motion'
import { Bell, Pencil, Trash2 } from 'lucide-react'
import type { Note } from './types'
import { Button } from '@/components/ui/Button'
import { useTelegram } from '@/hooks'

type Props = {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (note: Note) => void
  index?: number
}

function formatReminder(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const noteDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const time = d.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
  if (noteDate.getTime() === today.getTime()) {
    return `Сегодня, ${time}`
  }
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (noteDate.getTime() === tomorrow.getTime()) {
    return `Завтра, ${time}`
  }
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function NoteItem({ note, onEdit, onDelete, index = 0 }: Props) {
  const { haptic } = useTelegram()
  const hasReminder = note.reminderAt && new Date(note.reminderAt) > new Date()

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.15) }}
      className="rounded-2xl border border-tg-bg-secondary/50 bg-tg-bg-secondary/60 overflow-hidden"
    >
      <button
        type="button"
        className="w-full p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-tg-button rounded-2xl"
        onClick={() => {
          haptic.impact('light')
          onEdit(note)
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-tg-text truncate">
              {note.title || 'Без названия'}
            </h3>
            {note.content ? (
              <p className="mt-0.5 text-sm text-tg-hint line-clamp-2">
                {note.content}
              </p>
            ) : null}
            {hasReminder && note.reminderAt && (
              <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-tg-button">
                <Bell className="h-3.5 w-3.5 shrink-0" />
                {formatReminder(note.reminderAt)}
              </p>
            )}
          </div>
        </div>
      </button>
      <div className="flex border-t border-tg-bg-secondary/80 px-2 py-1">
        <Button
          variant="ghost"
          size="icon"
          className="flex-1 text-tg-hint"
          onClick={() => {
            haptic.impact('light')
            onEdit(note)
          }}
          aria-label="Редактировать"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="flex-1 text-tg-hint hover:text-red-500"
          onClick={() => {
            haptic.impact('medium')
            onDelete(note)
          }}
          aria-label="Удалить"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.li>
  )
}
