export const INCOME_CATEGORIES = [
  'Зарплата',
  'Подработка',
  'Дивиденды',
  'Подарок',
  'Возврат',
  'Другое',
] as const

export const EXPENSE_CATEGORIES = [
  'Еда',
  'Транспорт',
  'Жильё',
  'Здоровье',
  'Развлечения',
  'Одежда',
  'Связь',
  'Подписки',
  'Другое',
] as const

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number]
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]
