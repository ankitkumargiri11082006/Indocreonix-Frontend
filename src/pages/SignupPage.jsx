import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signup(formData.name, formData.email, formData.password)
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

          <h2>Launch Your Admin Workspace</h2>
          <p>
            Create your secure account and control every operational layer from analytics to branding in a unified, premium panel.
          </p>

          <ul className="auth-feature-list">
            <li>First account becomes super admin</li>
            <li>Custom color and typography controls</li>
            <li>Team-ready dashboards and workflows</li>
          </ul>
        </aside>

        <div className="auth-card">
          <p className="auth-badge">Create Admin Account</p>
          <h1>Sign up for Indocreonix Admin</h1>
          <p className="auth-subtitle">First account automatically becomes admin on backend.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Full Name
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
                required
              />
            </label>

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
                  placeholder="Create a secure password"
                  minLength={6}
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
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="auth-footer">
            Already registered? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default SignupPage
