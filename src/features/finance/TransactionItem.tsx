import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import type { Transaction } from './types'
import { formatCurrencySigned } from '@/utils'
import { Button } from '@/components/ui/Button'
import { useTelegram } from '@/hooks'
import { cn } from '@/utils'

type Props = {
  transaction: Transaction
  onDelete: (id: string) => void
  index?: number
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Сегодня'
  if (d.toDateString() === yesterday.toDateString()) return 'Вчера'
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export function TransactionItem({ transaction, onDelete, index = 0 }: Props) {
  const { haptic } = useTelegram()
  const isIncome = transaction.type === 'income'

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.15) }}
      className={cn(
        'flex items-center gap-3 rounded-xl border border-tg-bg-secondary/50 bg-tg-bg-secondary/60 p-3'
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="font-medium text-tg-text">{transaction.category}</p>
        <p className="text-sm text-tg-hint">
          {formatDate(transaction.date)}
          {transaction.comment ? ` · ${transaction.comment}` : ''}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'text-right font-semibold tabular-nums',
            isIncome ? 'text-emerald-500' : 'text-red-500'
          )}
        >
          {formatCurrencySigned(transaction.amount, transaction.type)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            haptic.impact('medium')
            onDelete(transaction.id)
          }}
          aria-label="Удалить"
          className="text-tg-hint hover:text-red-500"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </motion.li>
  )
}
