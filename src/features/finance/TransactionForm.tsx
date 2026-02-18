import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { TransactionType } from './types'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from './constants'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useFinanceStore } from '@/store/financeStore'
import { useTelegram } from '@/hooks'
import { cn } from '@/utils'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const typeLabels: Record<TransactionType, string> = {
  income: 'Доход',
  expense: 'Расход',
}

export function TransactionForm({ open, onOpenChange }: Props) {
  const { haptic } = useTelegram()
  const addTransaction = useFinanceStore((s) => s.addTransaction)
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0])
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const reset = () => {
    setType('expense')
    setAmount('')
    setCategory(EXPENSE_CATEGORIES[0])
    setDate(new Date().toISOString().slice(0, 10))
    setComment('')
    setError('')
  }

  useEffect(() => {
    if (open) reset()
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const num = amount.replace(/\s/g, '').replace(',', '.')
    const value = parseFloat(num)
    if (!Number.isFinite(value) || value <= 0) {
      setError('Введите корректную сумму')
      return
    }
    haptic.notification('success')
    addTransaction({
      amount: Math.round(value * 100) / 100,
      category,
      type,
      date: new Date(date).toISOString().slice(0, 10),
      comment: comment.trim() || undefined,
    })
    reset()
    onOpenChange(false)
  }

  const handleTypeChange = (t: TransactionType) => {
    setType(t)
    setCategory(t === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0])
    haptic.selection()
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-tg-bg-secondary bg-tg-bg p-4 shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-tg-text">
              Новая операция
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Закрыть">
                <X className="h-5 w-5" />
              </Button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-tg-text">Тип</p>
              <div className="flex gap-2">
                {(['expense', 'income'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTypeChange(t)}
                    className={cn(
                      'flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors',
                      type === t
                        ? 'bg-tg-button text-tg-button-text'
                        : 'bg-tg-bg-secondary text-tg-hint'
                    )}
                  >
                    {typeLabels[t]}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Сумма"
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={error}
            />

            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-tg-text">Категория</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-12 w-full rounded-xl border border-tg-bg-secondary bg-tg-bg-secondary px-4 text-base text-tg-text focus:border-tg-button focus:outline-none focus:ring-2 focus:ring-tg-button/20"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Дата"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <Input
              label="Комментарий (необязательно)"
              type="text"
              placeholder="Заметка"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

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
                Добавить
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
