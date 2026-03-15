import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../lib/apiClient'

const ThemeContext = createContext(null)

function applyTheme(theme) {
  const root = document.documentElement
  root.style.setProperty('--brand-primary', theme?.primary || '#4285f4')
  root.style.setProperty('--brand-secondary', theme?.secondary || '#ea4335')
  root.style.setProperty('--brand-accent', theme?.accent || '#fbbc05')
  root.style.setProperty('--brand-success', theme?.success || '#34a853')
  root.style.setProperty('--brand-heading-font', `"${theme?.headingFont || 'Outfit'}", "Inter", sans-serif`)
  root.style.setProperty('--brand-body-font', `"${theme?.bodyFont || 'Inter'}", sans-serif`)
}

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    apiRequest('/settings')
      .then((result) => {
        setSettings(result.settings)
        applyTheme(result.settings?.theme)
      })
      .catch(() => {
        applyTheme(null)
      })
  }, [])

  const value = useMemo(
    () => ({
      settings,
      setThemeFromSettings(nextSettings) {
        setSettings(nextSettings)
        applyTheme(nextSettings?.theme)
      },
    }),
    [settings]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeSettings() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeSettings must be used within ThemeProvider')
  }
  return context
}
