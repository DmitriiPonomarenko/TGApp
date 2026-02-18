import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Note } from '@/features/notes/types'

const STORAGE_KEY = 'tg-notes'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export interface NotesState {
  notes: Note[]
  addNote: (n: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note
  addNoteFromServer: (note: Note) => void
  setNotes: (notes: Note[]) => void
  updateNote: (id: string, patch: Partial<Pick<Note, 'title' | 'content' | 'reminderAt'>>) => void
  removeNote: (id: string) => void
  getNoteById: (id: string) => Note | undefined
  getNotes: () => Note[]
  getNotesWithReminders: () => Note[]
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (n) => {
        const now = Date.now()
        const newNote: Note = {
          ...n,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({
          notes: [newNote, ...state.notes],
        }))
        return newNote
      },

      addNoteFromServer: (note) => {
        set((state) => ({
          notes: [note, ...state.notes],
        }))
      },

      setNotes: (notes) => {
        set({ notes })
      },

      updateNote: (id, patch) => {
        const now = Date.now()
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...patch, updatedAt: now }
              : note
          ),
        }))
      },

      removeNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }))
      },

      getNoteById: (id) => get().notes.find((n) => n.id === id),

      getNotes: () => get().notes,

      getNotesWithReminders: () =>
        get().notes.filter((n) => n.reminderAt && new Date(n.reminderAt) > new Date()),
    }),
    { name: STORAGE_KEY }
  )
)
