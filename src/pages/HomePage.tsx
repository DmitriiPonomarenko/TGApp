import { useTelegram } from '@/hooks/useTelegram'

export function HomePage() {
  useTelegram()
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold text-tg-text">Главная</h1>
      <p className="mt-2 text-tg-hint">Добро пожаловать. Выберите раздел внизу.</p>
    </div>
  )
}
