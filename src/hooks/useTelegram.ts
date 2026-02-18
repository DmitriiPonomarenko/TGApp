import { useEffect, useMemo } from 'react'
import WebApp from '@twa-dev/sdk'

const TG_THEME_KEYS: Record<string, string> = {
  bg_color: '--tg-theme-bg-color',
  secondary_bg_color: '--tg-theme-secondary-bg-color',
  text_color: '--tg-theme-text-color',
  hint_color: '--tg-theme-hint-color',
  link_color: '--tg-theme-link-color',
  button_color: '--tg-theme-button-color',
  button_text_color: '--tg-theme-button-text-color',
}

function applyTelegramTheme() {
  const root = document.documentElement
  const params = WebApp.themeParams
  if (!params) return
  for (const [key, cssVar] of Object.entries(TG_THEME_KEYS)) {
    const value = (params as unknown as Record<string, string>)[key]
    if (value) root.style.setProperty(cssVar, value)
  }
}

export function useTelegram() {
  useEffect(() => {
    WebApp.ready()
    WebApp.expand()
    applyTelegramTheme()
    WebApp.onEvent('themeChanged', applyTelegramTheme)
    return () => {
      WebApp.offEvent('themeChanged', applyTelegramTheme)
    }
  }, [])

  return useMemo(() => ({
    webApp: WebApp,
    themeParams: WebApp.themeParams,
    haptic: {
      impact: (style: 'light' | 'medium' | 'heavy' = 'light') => {
        try {
          WebApp.HapticFeedback?.impactOccurred(style)
        } catch {
          // не поддерживается или не в TMA
        }
      },
      notification: (type: 'error' | 'success' | 'warning') => {
        try {
          WebApp.HapticFeedback?.notificationOccurred(type)
        } catch {
          //
        }
      },
      selection: () => {
        try {
          WebApp.HapticFeedback?.selectionChanged()
        } catch {
          //
        }
      },
    },
    isReady: true,
  }), [])
}
