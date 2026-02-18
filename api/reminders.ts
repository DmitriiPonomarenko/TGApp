import { createClient } from '@supabase/supabase-js'

type VercelRequest = { method?: string; body?: Record<string, unknown>; query?: Record<string, string> }
type VercelResponse = {
  status: (n: number) => VercelResponse
  json: (o: object) => void
  setHeader: (name: string, value: string) => void
  end: () => void
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function getSupabase() {
  if (!supabaseUrl || !supabaseServiceKey) return null
  return createClient(supabaseUrl, supabaseServiceKey)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  const supabase = getSupabase()
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' })
  }

  if (req.method === 'POST') {
    const { telegramUserId, noteId, reminderAt, title, content } = req.body || {}
    if (!telegramUserId || !noteId || !reminderAt) {
      return res.status(400).json({
        error: 'Missing telegramUserId, noteId or reminderAt',
      })
    }
    const { error } = await supabase.from('reminders').insert({
      telegram_user_id: Number(telegramUserId),
      note_id: String(noteId),
      reminder_at: new Date(reminderAt).toISOString(),
      title: title != null ? String(title) : '',
      content: content != null ? String(content) : '',
    })
    if (error) {
      console.error('[api/reminders] insert error', error)
      return res.status(500).json({ error: error.message })
    }
    return res.status(201).json({ ok: true })
  }

  if (req.method === 'DELETE') {
    const noteId = (req.query.noteId as string) || (req.body && req.body.noteId)
    if (!noteId) {
      return res.status(400).json({ error: 'Missing noteId' })
    }
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('note_id', noteId)
      .is('sent_at', null)
    if (error) {
      console.error('[api/reminders] delete/cancel error', error)
      return res.status(500).json({ error: error.message })
    }
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
