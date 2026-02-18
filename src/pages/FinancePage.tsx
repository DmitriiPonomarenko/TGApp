import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useTelegram, useFinanceActions } from '@/hooks'
import { useFinanceStore } from '@/store/financeStore'
import { formatCurrency } from '@/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TransactionItem } from '@/features/finance/TransactionItem'
import { TransactionForm } from '@/features/finance/TransactionForm'

const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth()

export function FinancePage() {
  const [formOpen, setFormOpen] = useState(false)
  const telegramUserId = useTelegram().webApp.initDataUnsafe?.user?.id
  const { removeTransaction } = useFinanceActions(telegramUserId)
  const transactions = useFinanceStore((s) => s.transactions)
  const balance = useFinanceStore((s) => s.getBalance())
  const monthlyIncome = useFinanceStore((s) =>
    s.getMonthlyIncome(currentYear, currentMonth)
  )
  const monthlyExpense = useFinanceStore((s) =>
    s.getMonthlyExpense(currentYear, currentMonth)
  )
  const recent = transactions.slice(0, 30)

  const monthLabel = now.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="p-4 pb-8">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-tg-text">Финансы</h1>
        <p className="text-sm text-tg-hint">{monthLabel}</p>
      </header>

      <div className="mb-6 space-y-3">
        <Card>
          <CardHeader>
            <CardTitle>Баланс</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold tabular-nums ${
                balance >= 0 ? 'text-tg-text' : 'text-red-500'
              }`}
            >
              {formatCurrency(balance)}
            </p>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader>
              <CardTitle>Доход за месяц</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold tabular-nums text-emerald-500">
                {formatCurrency(monthlyIncome)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Расход за месяц</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold tabular-nums text-red-500">
                {formatCurrency(monthlyExpense)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-tg-text">
          Последние операции
        </h2>
        <Button
          size="sm"
          onClick={() => setFormOpen(true)}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Добавить
        </Button>
      </div>

      {recent.length === 0 ? (
        <p className="py-8 text-center text-tg-hint">
          Пока нет операций. Нажмите «Добавить», чтобы создать первую.
        </p>
      ) : (
        <ul className="space-y-2 list-none p-0 m-0">
          <AnimatePresence mode="popLayout">
            {recent.map((tr, i) => (
              <TransactionItem
                key={tr.id}
                transaction={tr}
                onDelete={removeTransaction}
                index={i}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}

      <TransactionForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  )
}
