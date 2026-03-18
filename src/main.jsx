import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { SpeedInsights } from "@vercel/speed-insights/react"

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <App />
        <SpeedInsights />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>,
)
