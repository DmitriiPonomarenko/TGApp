import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transaction } from '@/features/finance/types'

const STORAGE_KEY = 'tg-finance-transactions'

export interface FinanceState {
  transactions: Transaction[]
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void
  addTransactionFromServer: (t: Transaction) => void
  setTransactions: (transactions: Transaction[]) => void
  removeTransaction: (id: string) => void
  getBalance: () => number
  getMonthlyIncome: (year: number, month: number) => number
  getMonthlyExpense: (year: number, month: number) => number
  getTransactionsForMonth: (year: number, month: number) => Transaction[]
  getRecentTransactions: (limit?: number) => Transaction[]
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (t) => {
        const newT: Transaction = {
          ...t,
          id: generateId(),
          createdAt: Date.now(),
        }
        set((state) => ({
          transactions: [newT, ...state.transactions],
        }))
      },

      addTransactionFromServer: (t) => {
        set((state) => ({
          transactions: [t, ...state.transactions],
        }))
      },

      setTransactions: (transactions) => {
        set({ transactions })
      },

      removeTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((tr) => tr.id !== id),
        }))
      },

      getBalance: () => {
        return get().transactions.reduce((sum, tr) => {
          return sum + (tr.type === 'income' ? tr.amount : -tr.amount)
        }, 0)
      },

      getMonthlyIncome: (year, month) => {
        return get()
          .transactions.filter(
            (tr) =>
              tr.type === 'income' &&
              new Date(tr.date).getFullYear() === year &&
              new Date(tr.date).getMonth() === month
          )
          .reduce((sum, tr) => sum + tr.amount, 0)
      },

      getMonthlyExpense: (year, month) => {
        return get()
          .transactions.filter(
            (tr) =>
              tr.type === 'expense' &&
              new Date(tr.date).getFullYear() === year &&
              new Date(tr.date).getMonth() === month
          )
          .reduce((sum, tr) => sum + tr.amount, 0)
      },

      getTransactionsForMonth: (year, month) => {
        return get().transactions.filter((tr) => {
          const d = new Date(tr.date)
          return d.getFullYear() === year && d.getMonth() === month
        })
      },

      getRecentTransactions: (limit = 50) => {
        return get().transactions.slice(0, limit)
      },
    }),
    { name: STORAGE_KEY }
  )
)
