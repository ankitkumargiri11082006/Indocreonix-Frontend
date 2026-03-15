import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData.email, formData.password)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-grid">
        <aside className="auth-showcase">
          <div className="auth-brand-row">
            <img src="/logo.png" alt="Indocreonix" className="auth-brand-logo" />
            <div>
              <p className="auth-brand-title">Indocreonix</p>
              <p className="auth-brand-tag">Build. Scale. Lead.</p>
            </div>
          </div>

          <h2>Advanced Command Center</h2>
          <p>
            Access your full operations suite with colorful branding, secure controls, and real-time management for leads, media, users, and settings.
          </p>

          <ul className="auth-feature-list">
            <li>Role-based secure admin access</li>
            <li>Brand customization with live theme controls</li>
            <li>Cloud media and lead pipeline management</li>
          </ul>
        </aside>

        <div className="auth-card">
          <p className="auth-badge">Admin Access</p>
          <h1>Login to Indocreonix</h1>
          <p className="auth-subtitle">Manage users, leads, branding, content and media from one place.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="you@indocreonix.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
                required
              />
            </label>

            {error ? <p className="auth-error">{error}</p> : null}

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="auth-footer">
            New here? <Link to="/signup">Create account</Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
