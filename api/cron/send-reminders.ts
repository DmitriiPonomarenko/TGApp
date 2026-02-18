import { createClient } from '@supabase/supabase-js'

type VercelRequest = { headers?: { authorization?: string } }
type VercelResponse = {
  status: (n: number) => VercelResponse
  json: (o: object) => void
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
const cronSecret = process.env.CRON_SECRET

const TELEGRAM_API = 'https://api.telegram.org'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = req.headers.authorization
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!supabaseUrl || !supabaseServiceKey || !telegramBotToken) {
    return res.status(500).json({ error: 'Missing env: SUPABASE_* or TELEGRAM_BOT_TOKEN' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const now = new Date().toISOString()

  const { data: due, error: fetchError } = await supabase
    .from('reminders')
    .select('id, telegram_user_id, title, content')
    .is('sent_at', null)
    .lte('reminder_at', now)

  if (fetchError) {
    console.error('[cron/send-reminders] fetch error', fetchError)
    return res.status(500).json({ error: fetchError.message })
  }

  if (!due || due.length === 0) {
    return res.status(200).json({ sent: 0 })
  }

  let sent = 0
  for (const row of due) {
    const text = [row.title, row.content].filter(Boolean).join('\n\n') || 'Напоминание'
    const url = `${TELEGRAM_API}/bot${telegramBotToken}/sendMessage`
    const body = {
      chat_id: row.telegram_user_id,
      text,
    }
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await r.json().catch(() => ({}))
      if (!data.ok) {
        console.error('[cron/send-reminders] Telegram error', data)
        continue
      }
      await supabase
        .from('reminders')
        .update({ sent_at: new Date().toISOString() })
        .eq('id', row.id)
      sent++
    } catch (e) {
      console.error('[cron/send-reminders] send error', e)
    }
  }

  return res.status(200).json({ sent, total: due.length })
}
