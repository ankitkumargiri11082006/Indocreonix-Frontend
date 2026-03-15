import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
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
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Create a secure password"
                minLength={6}
                required
              />
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
