/**
 * Форматирование суммы для отображения (рубли).
 * Для смены валюты позже — централизованное место.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCurrencySigned(amount: number, type: 'income' | 'expense'): string {
  const formatted = formatCurrency(Math.abs(amount))
  return type === 'income' ? `+${formatted}` : `−${formatted}`
}
