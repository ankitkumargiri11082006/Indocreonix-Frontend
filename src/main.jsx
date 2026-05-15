import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import SessionTimeoutManager from './components/SessionTimeoutManager'

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  const isLocalhost = /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname)
  if (isLocalhost) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister()
      })
    })
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Proactively check for updates on each load.
          registration.update().catch(() => {
            // Ignore update failures.
          })

          const hasReloadedKey = 'indocx_sw_reloaded'
          const hasReloaded = sessionStorage.getItem(hasReloadedKey) === '1'

          const reloadOnce = () => {
            if (sessionStorage.getItem(hasReloadedKey) === '1') return
            sessionStorage.setItem(hasReloadedKey, '1')
            window.location.reload()
          }

          if (registration.waiting && navigator.serviceWorker.controller && !hasReloaded) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' })
            reloadOnce()
          }

          registration.addEventListener('updatefound', () => {
            const installing = registration.installing
            if (!installing) return

            installing.addEventListener('statechange', () => {
              if (
                installing.state === 'installed' &&
                navigator.serviceWorker.controller &&
                sessionStorage.getItem(hasReloadedKey) !== '1'
              ) {
                reloadOnce()
              }
            })
          })
        })
        .catch(() => {
          // Ignore registration failures to avoid blocking app bootstrap.
        })
    })
  }
}

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
          <SessionTimeoutManager />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </HelmetProvider>,
)
