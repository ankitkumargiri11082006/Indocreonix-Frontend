import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import { portalRequest, setPortalSession } from './portalAuthShared'
import './PortalPages.css'

const INITIAL_FORM = {
  name: '',
  email: '',
  track: 'both',
  otp: '',
  password: '',
  confirmPassword: '',
}

function PortalSignUpPage() {
  const navigate = useNavigate()
  const googleButtonRef = useRef(null)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleReady, setGoogleReady] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const googleClientId = useMemo(() => (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim(), [])

  useEffect(() => {
    if (!googleClientId) return

    let mounted = true

    const initializeGoogleSignIn = () => {
      if (!mounted || !window.google?.accounts?.id || !googleButtonRef.current) return

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (!response?.credential) {
            setError('Google sign-up failed. Please try again.')
            return
          }

          setError('')
          setMessage('')
          setGoogleLoading(true)

          try {
            const result = await portalRequest('/portal/auth/google', {
              method: 'POST',
              body: JSON.stringify({ credential: response.credential, flow: 'signup', track: formData.track }),
            })
            setPortalSession({ token: result.token, user: result.user })
            navigate(result?.user?.defaultDashboard === 'project' ? '/project/dashboard' : '/career/dashboard')
          } catch (err) {
            setError(err.message)
          } finally {
            setGoogleLoading(false)
          }
        },
      })

      googleButtonRef.current.innerHTML = ''
      const width = window.innerWidth <= 460 ? Math.max(240, window.innerWidth - 92) : 360
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: 'standard',
        theme: 'filled_blue',
        size: 'large',
        text: 'signup_with',
        shape: 'pill',
        width,
        logo_alignment: 'left',
      })

      setGoogleReady(true)
    }

    if (window.google?.accounts?.id) {
      initializeGoogleSignIn()
      return () => {
        mounted = false
      }
    }

    const scriptId = 'google-identity-services-script'
    const existingScript = document.getElementById(scriptId)

    if (existingScript) {
      existingScript.addEventListener('load', initializeGoogleSignIn)
      return () => {
        mounted = false
        existingScript.removeEventListener('load', initializeGoogleSignIn)
      }
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.addEventListener('load', initializeGoogleSignIn)
    document.body.appendChild(script)

    return () => {
      mounted = false
      script.removeEventListener('load', initializeGoogleSignIn)
    }
  }, [formData.track, googleClientId, navigate])

  async function sendOtp(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!formData.name.trim()) {
      setError('Name is required.')
      return
    }

    setLoading(true)
    try {
      await portalRequest('/portal/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ name: formData.name, email: formData.email, track: formData.track }),
      })
      setMessage('OTP sent to your email. Verify to complete sign-up.')
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function verifyOtpAndCreate(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password and confirm password do not match.')
      return
    }

    setLoading(true)
    try {
      const result = await portalRequest('/portal/auth/verify-otp-register', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          otp: formData.otp,
          password: formData.password,
          track: formData.track,
        }),
      })

      setPortalSession({ token: result.token, user: result.user })
      navigate(result?.user?.defaultDashboard === 'project' ? '/project/dashboard' : '/career/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Portal Sign Up" description="Create account with Google or email OTP verification." noindex={true} />
      <section className="portal-shell portal-shell-signup">
        <div className="portal-grid">
          <aside className="portal-hero-card">
            <p className="portal-kicker">Secure Access Setup</p>
            <h1>Create Your Career + Project Account</h1>
            <p>
              Google sign-up is always enabled. If you choose email sign-up, OTP verification is required before password setup.
            </p>
            <ol className="portal-step-list" aria-hidden="true">
              <li className={step >= 1 ? 'active' : ''}>Account details</li>
              <li className={step >= 2 ? 'active' : ''}>Verify OTP + set password</li>
              <li className={step >= 3 ? 'active' : ''}>Access dashboard</li>
            </ol>
          </aside>

          <article className="portal-auth-card">
            <h2>Sign Up</h2>
            <p className="portal-auth-subtitle">Choose your preferred onboarding method.</p>

            <div className="portal-google-wrap">
              {googleClientId ? (
                <>
                  <div className="portal-google-slot" ref={googleButtonRef} />
                  {!googleReady ? <p className="portal-inline-note">Loading Google sign-up...</p> : null}
                  {googleLoading ? <p className="portal-inline-note">Provisioning your account...</p> : null}
                </>
              ) : (
                <p className="portal-inline-note portal-inline-warning">
                  Google sign-up is disabled. Add VITE_GOOGLE_CLIENT_ID in frontend env.
                </p>
              )}
            </div>

            <div className="portal-auth-divider"><span>or register with verified email OTP</span></div>

            {step === 1 ? (
              <form className="portal-form" onSubmit={sendOtp}>
                <label>
                  Full Name
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </label>

                <label>
                  Email
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="you@company.com"
                    required
                  />
                </label>

                <label>
                  Primary Track
                  <select
                    value={formData.track}
                    onChange={(event) => setFormData((prev) => ({ ...prev, track: event.target.value }))}
                  >
                    <option value="both">Career + Project</option>
                    <option value="career">Career only</option>
                    <option value="project">Project only</option>
                  </select>
                </label>

                {error ? <p className="portal-error">{error}</p> : null}
                {message ? <p className="portal-success">{message}</p> : null}

                <button type="submit" className="btn btn-primary portal-submit" disabled={loading || googleLoading}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form className="portal-form" onSubmit={verifyOtpAndCreate}>
                <label>
                  OTP Code
                  <input
                    type="text"
                    value={formData.otp}
                    onChange={(event) => setFormData((prev) => ({ ...prev, otp: event.target.value }))}
                    placeholder="Enter 6 digit OTP"
                    required
                  />
                </label>

                <label>
                  Set Password
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
                    placeholder="Create password"
                    required
                  />
                </label>

                <label>
                  Confirm Password
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(event) => setFormData((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                    placeholder="Confirm password"
                    required
                  />
                </label>

                {error ? <p className="portal-error">{error}</p> : null}
                {message ? <p className="portal-success">{message}</p> : null}

                <div className="portal-action-row">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setStep(1)
                      setError('')
                    }}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary portal-submit" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify OTP & Create Account'}
                  </button>
                </div>
              </form>
            )}

            <p className="portal-auth-footnote">
              Already have an account? <Link to="/portal/signin">Sign in here</Link>
            </p>
          </article>
        </div>
      </section>
    </>
  )
}

export default PortalSignUpPage
