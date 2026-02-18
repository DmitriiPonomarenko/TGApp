// Типы для фичи "Финансы" — шаг 4
export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  amount: number
  category: string
  type: TransactionType
  date: string
  comment?: string
  createdAt: number
}
