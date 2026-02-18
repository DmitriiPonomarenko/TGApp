/**
 * Заглушка для планирования напоминания.
 * В продакшене бэкенд по этому запросу должен:
 * - сохранить задачу на отправку уведомления в нужное время (cron/очередь),
 * - в указанный момент вызвать Telegram Bot API (sendMessage) и отправить
 *   пользователю сообщение с текстом напоминания.
 *
 * @param noteId — id заметки
 * @param reminderAt — ISO строка даты/времени напоминания
 * @param payload — данные для сообщения (заголовок/текст заметки)
 */
export async function scheduleReminder(
  noteId: string,
  reminderAt: string,
  payload: { title: string; content: string }
): Promise<void> {
  // TODO: заменить на реальный запрос к бэкенду, например:
  // await fetch('/api/reminders', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ noteId, reminderAt, ...payload }),
  // })
  if (process.env.NODE_ENV === 'development') {
    console.log('[reminders] scheduleReminder', { noteId, reminderAt, payload })
  }
}

/**
 * Отмена запланированного напоминания (при удалении или смене даты).
 */
export async function cancelReminder(noteId: string): Promise<void> {
  // await fetch(`/api/reminders/${noteId}`, { method: 'DELETE' })
  if (process.env.NODE_ENV === 'development') {
    console.log('[reminders] cancelReminder', noteId)
  }
}
