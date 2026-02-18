import { useTelegram } from '@/hooks'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export function ProfilePage() {
  const { webApp } = useTelegram()
  const user = webApp.initDataUnsafe?.user

  return (
    <div className="p-4 pb-8">
      <header className="page-header mb-6">
        <h1 className="text-xl font-semibold text-tg-text">Профиль</h1>
        <p className="text-sm text-tg-hint">
          Данные из Telegram
        </p>
      </header>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Пользователь</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <p className="text-tg-text">
              {user.first_name} {user.last_name ?? ''}
              {user.username && (
                <span className="block mt-1 text-sm text-tg-hint">@{user.username}</span>
              )}
            </p>
          ) : (
            <p className="text-tg-hint">Откройте приложение в Telegram, чтобы увидеть данные профиля.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
