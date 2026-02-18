-- Запусти в Supabase Dashboard → SQL Editor (один раз для нового проекта).

-- Таблица транзакций (финансы)
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  telegram_user_id bigint not null,
  amount numeric(12, 2) not null,
  category text not null,
  type text not null check (type in ('income', 'expense')),
  date date not null,
  comment text,
  created_at bigint not null
);

create index if not exists idx_transactions_telegram_user_id
  on public.transactions (telegram_user_id);
create index if not exists idx_transactions_date
  on public.transactions (telegram_user_id, date desc);

-- Таблица заметок
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  telegram_user_id bigint not null,
  title text not null default '',
  content text not null default '',
  reminder_at timestamptz,
  created_at bigint not null,
  updated_at bigint not null
);

create index if not exists idx_notes_telegram_user_id
  on public.notes (telegram_user_id);

-- RLS: включить и настроить под свою авторизацию (опционально).
-- Сейчас запросы фильтруются по telegram_user_id на клиенте.
-- Для продакшена рекомендуется включить RLS и проверять пользователя через JWT или Edge Function.
-- alter table public.transactions enable row level security;
-- alter table public.notes enable row level security;
