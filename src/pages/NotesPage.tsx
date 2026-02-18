import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useUserId, useNotesActions } from '@/hooks'
import { useNotesStore } from '@/store/notesStore'
import { cancelReminder, type Note } from '@/features/notes'
import { Button } from '@/components/ui/Button'
import { NoteItem } from '@/features/notes/NoteItem'
import { NoteForm } from '@/features/notes/NoteForm'

export function NotesPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const userId = useUserId()
  const { removeNote } = useNotesActions(userId)
  const notes = useNotesStore((s) => s.notes)

  const handleDelete = async (note: Note) => {
    if (note.reminderAt) await cancelReminder(note.id)
    await removeNote(note.id)
  }

  const openCreate = () => {
    setEditingNote(null)
    setFormOpen(true)
  }

  const openEdit = (note: Note) => {
    setEditingNote(note)
    setFormOpen(true)
  }

  const handleCloseForm = (open: boolean) => {
    setFormOpen(open)
    if (!open) setEditingNote(null)
  }

  return (
    <div className="p-4 pb-8">
      <header className="page-header mb-6">
        <h1 className="text-xl font-semibold text-tg-text">Заметки</h1>
        <p className="text-sm text-tg-hint">
          Заметки с напоминаниями в Telegram
        </p>
      </header>

      <div className="page-content">
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={openCreate} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Создать
        </Button>
      </div>

      {notes.length === 0 ? (
        <p className="py-8 text-center text-tg-hint">
          Нет заметок. Нажмите «Создать», чтобы добавить первую.
        </p>
      ) : (
        <ul className="space-y-3 list-none p-0 m-0">
          <AnimatePresence mode="popLayout">
            {notes.map((note, i) => (
              <NoteItem
                key={note.id}
                note={note}
                onEdit={openEdit}
                onDelete={handleDelete}
                index={i}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
      </div>

      <NoteForm
        open={formOpen}
        onOpenChange={handleCloseForm}
        editNote={editingNote}
      />
    </div>
  )
}
