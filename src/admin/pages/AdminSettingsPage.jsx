import { useEffect, useState } from 'react'
import { apiRequest } from '../../lib/apiClient'
import { useThemeSettings } from '../../context/ThemeContext'

function AdminSettingsPage() {
  const { setThemeFromSettings } = useThemeSettings()
  const [settings, setSettings] = useState({
    siteName: 'Indocreonix',
    tagline: 'Build. Scale. Lead.',
    supportEmail: '',
    supportPhone: '',
    theme: {
      primary: '#4285f4',
      secondary: '#ea4335',
      accent: '#fbbc05',
      success: '#34a853',
      headingFont: 'Outfit',
      bodyFont: 'Inter',
    },
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest('/settings')
      .then((result) => {
        if (result.settings) setSettings(result.settings)
      })
      .catch((err) => setError(err.message))
  }, [])

  async function saveSettings() {
    setMessage('')
    setError('')
    try {
      const result = await apiRequest('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      })
      setSettings(result.settings)
      setThemeFromSettings(result.settings)
      setMessage('Saved successfully')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <article className="admin-card wide">
      <h3>Brand & Theme Settings</h3>
      <p>Everything here is customizable and persists in MongoDB.</p>

      <div className="admin-form-grid three-colors">
        <label>
          Site Name
          <input
            value={settings.siteName || ''}
            onChange={(e) => setSettings((prev) => ({ ...prev, siteName: e.target.value }))}
          />
        </label>
        <label>
          Tagline
          <input
            value={settings.tagline || ''}
            onChange={(e) => setSettings((prev) => ({ ...prev, tagline: e.target.value }))}
          />
        </label>
        <label>
          Support Email
          <input
            value={settings.supportEmail || ''}
            onChange={(e) => setSettings((prev) => ({ ...prev, supportEmail: e.target.value }))}
          />
        </label>

        <label>
          Primary Color
          <input
            type="color"
            value={settings.theme?.primary || '#4285f4'}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, theme: { ...prev.theme, primary: e.target.value } }))
            }
          />
        </label>
        <label>
          Secondary Color
          <input
            type="color"
            value={settings.theme?.secondary || '#ea4335'}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, theme: { ...prev.theme, secondary: e.target.value } }))
            }
          />
        </label>
        <label>
          Accent Color
          <input
            type="color"
            value={settings.theme?.accent || '#fbbc05'}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, theme: { ...prev.theme, accent: e.target.value } }))
            }
          />
        </label>
      </div>

      <button type="button" className="btn btn-primary" onClick={saveSettings}>
        Save Settings
      </button>
      {message ? <p className="admin-success">{message}</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
    </article>
  )
}

export default AdminSettingsPage
