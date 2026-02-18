# TG Finance & Notes — План разработки

Telegram Mini App для учёта финансов и заметок с напоминаниями.

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **tailwindcss-animate**
- **Shadcn/ui** (Radix UI) — мобильная адаптация
- **Lucide React** — иконки
- **Framer Motion** — анимации
- **@twa-dev/sdk** — типы и API Telegram WebApp
- **Zustand** — состояние
- **React Router DOM** (HashRouter для TMA)
- **LocalStorage** → позже Supabase

---

## План по шагам

### Шаг 1 — Настройка проекта ✅
- [x] `package.json`: зависимости и скрипты
- [x] Vite: `base: './'`, алиас `@/`
- [x] TypeScript, Tailwind, PostCSS
- [x] Подключение `telegram-web-app.js` в `index.html`
- [x] CSS-переменные Telegram (fallback в `:root`)
- [x] HashRouter в `main.tsx`

### Шаг 2 — Базовая структура и Telegram WebApp
- Инициализация WebApp (SDK), применение темы
- Хук `useTelegram()` (WebApp, theme, haptic)
- Папки: `components`, `features`, `hooks`, `store`, `pages`, `utils`
- Заглушки страниц и роутинг

### Шаг 3 — Layout
- Нижняя навигация: Финансы | Заметки | Профиль
- Адаптивный контейнер, safe area
- Framer Motion: переходы между экранами

### Шаг 4 — Финансы
- Модель данных (транзакции), Zustand store
- Экран списка операций, баланс, статистика за месяц
- Форма: сумма, категория, доход/расход, дата, комментарий
- Компоненты: TransactionItem, Card, форма

### Шаг 5 — Заметки и напоминания
- CRUD заметок, store
- Форма заметки + дата/время напоминания
- Заглушка API для отправки напоминания через Bot API

### Шаг 6 — Полировка
- Haptic feedback на кнопках
- Финальные анимации и отступы
- Проверка в Telegram клиенте

---

## Запуск

```bash
npm install
npm run dev
```

Сборка для деплоя:

```bash
npm run build
```

Превью сборки: `npm run preview`.

---

## Деплой

Проект настроен для **Vercel** и **Netlify**. Роутинг через hash (`#/finance`), поэтому один `index.html` — хостинг отдаёт статику из `dist/`.

### Vercel

1. Залить код в GitHub и зайти на [vercel.com](https://vercel.com).
2. **Add New** → **Project** → импорт репозитория (например `DmitriiPonomarenko/TGApp`).
3. Оставить настройки по умолчанию (Vite подхватывается автоматически, в проекте есть `vercel.json`).
4. **Перед первым Deploy** — открой **Environment Variables**. Добавь две переменные (значения из своего `.env`):
   - `VITE_SUPABASE_URL` = `https://atuerhjlosyzblsgtipu.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = твой anon-ключ
   Сохрани.
5. Нажми **Deploy**. После деплоя будет URL вида `https://твой-проект.vercel.app` — его укажешь в BotFather как URL Mini App.

### Netlify

1. Репозиторий на GitHub → [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
2. Выбрать репозиторий. В настройках сборки указано в `netlify.toml`: команда `npm run build`, папка публикации `dist`.
3. **Перед Deploy** — **Site settings** → **Environment variables** → **Add variable** (или **Add from .env**): добавь `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`.
4. **Deploy**. URL: `https://имя-сайта.netlify.app`.

### Подключение к Telegram

1. Создай бота в [@BotFather](https://t.me/BotFather), получи токен.
2. **Menu Button / Web App:** в BotFather → твой бот → **Bot Settings** → **Menu Button** → укажи URL приложения (твой деплой), например:
   - `https://твой-проект.vercel.app`
   - или свой домен: `https://mydomain.com`
3. Пользователи откроют бота и нажмут кнопку меню — откроется Mini App с твоим приложением.

Важно: для Mini App нужен **HTTPS**. Локально можно тестировать через [Telegram Web App Tester](https://core.telegram.org/bots/webapps#testing-mini-apps) или туннель (ngrok, cloudflared), указав HTTPS-URL.

---

## Supabase

Приложение поддерживает хранение данных в Supabase. Если переменные не заданы — используется только LocalStorage.

### Настройка

1. Создай проект на [supabase.com](https://supabase.com).
2. В **SQL Editor** выполни скрипт из `supabase/schema.sql` (создаст таблицы `transactions` и `notes`).
3. **Скопировать URL и ключ в `.env`:**
   - Зайди в [app.supabase.com](https://app.supabase.com) и открой свой проект.
   - В левом меню нажми **Project Settings** (иконка шестерёнки внизу).
   - Открой вкладку **API**.
   - Там будут:
     - **Project URL** — длинная ссылка вида `https://abcdefghijk.supabase.co`.
     - **Project API keys** — блок с ключами. Нужен ключ **anon** (public), не secret. Нажми **Reveal** и скопируй значение (длинная строка вроде `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`).
   - В корне проекта (рядом с `package.json`) создай файл **`.env`** (именно с точкой в начале).
   - Вставь в него две строки, подставив свои значения (без кавычек):
     ```
     VITE_SUPABASE_URL=https://твой-проект.supabase.co
     VITE_SUPABASE_ANON_KEY=вставь_сюда_скопированный_anon_ключ
     ```
   - Сохрани файл. Файл `.env` в репозиторий не коммить (он уже в `.gitignore`).
4. Перезапусти dev-сервер: останови (`Ctrl+C`) и снова выполни `npm run dev`.

Данные привязаны к `telegram_user_id` (из `WebApp.initDataUnsafe.user.id`). В Telegram при открытии Mini App подставляется пользователь, и его транзакции/заметки подтягиваются из Supabase. Без Supabase всё по-прежнему хранится в LocalStorage.

---

## Напоминания (Telegram)

Если у заметки указана дата/время напоминания, приложение отправляет задачу на бэкенд; раз в несколько минут cron вызывает API и шлёт пользователю сообщение в Telegram через Bot API.

### Что уже сделано

- Таблица **`reminders`** в Supabase (добавлена в `supabase/schema.sql` — выполни скрипт, если создавал таблицы раньше; иначе создастся при первом запуске полного скрипта).
- **POST /api/reminders** — приложение вызывает при сохранении заметки с напоминанием (тело: `telegramUserId`, `noteId`, `reminderAt`, `title`, `content`).
- **DELETE /api/reminders?noteId=...** — отмена напоминания (удаление заметки или смена даты).
- **GET /api/cron/send-reminders** — забирает из БД напоминания с `reminder_at <= now`, шлёт их в Telegram и помечает отправленными. Вызывать по расписанию (cron).

### Настройка на Vercel

1. **Environment Variables** в проекте Vercel:
   - **SUPABASE_URL** — тот же Project URL из Supabase (или уже есть **VITE_SUPABASE_URL**).
   - **SUPABASE_SERVICE_ROLE_KEY** — в Supabase: **Project Settings** → **API** → ключ **service_role** (secret). Нужен для записи в таблицу `reminders` из API.
   - **TELEGRAM_BOT_TOKEN** — токен бота от [@BotFather](https://t.me/BotFather) (тот же бот, у которого открывается Mini App). Нужен, чтобы бот отправлял пользователю сообщение.
   - **CRON_SECRET** — любой длинный случайный пароль (например сгенерированный). Им будет защищён вызов cron.

2. **Запуск cron раз в 5 минут** (бесплатно):
   - Зайди на [cron-job.org](https://cron-job.org) (или аналог).
   - Создай задачу: URL = `https://твой-проект.vercel.app/api/cron/send-reminders`, метод GET (или POST).
   - В заголовках укажи: `Authorization: Bearer твой_CRON_SECRET`.
   - Расписание: каждые 5 минут (`*/5 * * * *` или выбор «каждые 5 минут»).

После этого напоминания из заметок будут уходить пользователю в Telegram в указанное время (с точностью до интервала cron, например до 5 минут).
