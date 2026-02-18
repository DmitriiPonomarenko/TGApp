/**
 * Планирование и отмена напоминаний через бэкенд.
 * Бэкенд сохраняет в Supabase; cron раз в N минут отправляет уведомления в Telegram.
 */

function getApiBase(): string {
  if (typeof window === 'undefined') return ''
  return (import.meta.env.VITE_API_URL as string) || window.location.origin
}

export async function scheduleReminder(
  noteId: string,
  reminderAt: string,
  payload: { title: string; content: string },
  telegramUserId: number
): Promise<void> {
  const base = getApiBase()
  const res = await fetch(`${base}/api/reminders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      telegramUserId,
      noteId,
      reminderAt,
      title: payload.title,
      content: payload.content,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error('[reminders] scheduleReminder failed', res.status, err)
  }
}

export async function cancelReminder(noteId: string): Promise<void> {
  const base = getApiBase()
  const res = await fetch(`${base}/api/reminders?noteId=${encodeURIComponent(noteId)}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    console.error('[reminders] cancelReminder failed', res.status)
  }
}
