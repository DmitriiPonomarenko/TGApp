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
2. **Add New** → **Project** → импорт репозитория.
3. Оставить настройки по умолчанию (Vite подхватывается автоматически, в проекте есть `vercel.json`).
4. **Deploy**. После деплоя будет URL вида `https://твой-проект.vercel.app`.

### Netlify

1. Репозиторий на GitHub → [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
2. Выбрать репозиторий. В настройках сборки указано в `netlify.toml`: команда `npm run build`, папка публикации `dist`.
3. **Deploy**. URL: `https://имя-сайта.netlify.app`.

### Подключение к Telegram

1. Создай бота в [@BotFather](https://t.me/BotFather), получи токен.
2. **Menu Button / Web App:** в BotFather → твой бот → **Bot Settings** → **Menu Button** → укажи URL приложения (твой деплой), например:
   - `https://твой-проект.vercel.app`
   - или свой домен: `https://mydomain.com`
3. Пользователи откроют бота и нажмут кнопку меню — откроется Mini App с твоим приложением.

Важно: для Mini App нужен **HTTPS**. Локально можно тестировать через [Telegram Web App Tester](https://core.telegram.org/bots/webapps#testing-mini-apps) или туннель (ngrok, cloudflared), указав HTTPS-URL.

---

## Подключение Supabase (позже)

- В `src` завести слой `api/` или `services/` с функциями для транзакций и заметок
- Store (Zustand) переключить с LocalStorage на вызовы API
- Ключи и URL — в `.env`, не коммитить
