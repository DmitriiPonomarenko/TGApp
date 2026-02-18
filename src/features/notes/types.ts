// Типы для фичи "Заметки" — шаг 5
export interface Note {
  id: string
  title: string
  content: string
  reminderAt?: string
  createdAt: number
  updatedAt: number
}
