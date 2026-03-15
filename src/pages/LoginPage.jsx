import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
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
              <div className="auth-password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M4.2 3.2 3 4.4l4.4 4.4C5.4 10.2 4 12 4 12s3 6 8 6c2 0 3.8-.6 5.2-1.6l2.4 2.4 1.2-1.2L4.2 3.2ZM12 16c-2.2 0-4-1.8-4-4 0-.9.3-1.7.8-2.3l1.5 1.5a2 2 0 0 0 2.4 2.4l1.5 1.5A3.9 3.9 0 0 1 12 16Zm0-10c5 0 8 6 8 6s-.8 1.7-2.5 3.2l-1.4-1.4a4 4 0 0 0-4.9-4.9L9.8 7.5A8.7 8.7 0 0 1 12 6Z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M12 6c5 0 8 6 8 6s-3 6-8 6-8-6-8-6 3-6 8-6Zm0 2c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
                    </svg>
                  )}
                </button>
              </div>
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
