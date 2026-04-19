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
      navigator.serviceWorker.register('/sw.js').catch(() => {
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
