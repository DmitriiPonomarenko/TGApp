import { NavLink } from 'react-router-dom'
import { Wallet, StickyNote, User } from 'lucide-react'
import { cn } from '@/utils'

const tabs = [
  { to: '/finance', label: 'Финансы', icon: Wallet },
  { to: '/notes', label: 'Заметки', icon: StickyNote },
  { to: '/profile', label: 'Профиль', icon: User },
] as const

type Props = {
  onNavigate?: () => void
}

export function BottomNav({ onNavigate }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-tg-bg-secondary/98 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-md"
      role="navigation"
      aria-label="Основное меню"
    >
      <ul className="flex items-center justify-around">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex min-h-[48px] min-w-[48px] flex-col items-center justify-center gap-1 rounded-xl px-4 py-2 transition-colors duration-200',
                  isActive
                    ? 'text-tg-button'
                    : 'text-tg-hint active:bg-tg-bg active:scale-[0.98]'
                )
              }
            >
              <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
