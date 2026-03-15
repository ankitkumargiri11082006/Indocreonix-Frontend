import { useState } from 'react'
import { apiRequest } from '../../lib/apiClient'

function PasswordToggleButton({ isVisible, onToggle }) {
  return (
    <button
      type="button"
      className="auth-password-toggle"
      onClick={onToggle}
      aria-label={isVisible ? 'Hide password' : 'Show password'}
      aria-pressed={isVisible}
    >
      {isVisible ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4.2 3.2 3 4.4l4.4 4.4C5.4 10.2 4 12 4 12s3 6 8 6c2 0 3.8-.6 5.2-1.6l2.4 2.4 1.2-1.2L4.2 3.2ZM12 16c-2.2 0-4-1.8-4-4 0-.9.3-1.7.8-2.3l1.5 1.5a2 2 0 0 0 2.4 2.4l1.5 1.5A3.9 3.9 0 0 1 12 16Zm0-10c5 0 8 6 8 6s-.8 1.7-2.5 3.2l-1.4-1.4a4 4 0 0 0-4.9-4.9L9.8 7.5A8.7 8.7 0 0 1 12 6Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 6c5 0 8 6 8 6s-3 6-8 6-8-6-8-6 3-6 8-6Zm0 2c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
        </svg>
      )}
    </button>
  )
}

function AdminChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match')
      return
    }

    try {
      setSaving(true)
      const response = await apiRequest('/auth/change-password', {
        method: 'PATCH',
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      setSuccess(response.message || 'Password changed successfully')
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <article className="admin-card wide">
      <h3 className="admin-password-title">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V7Zm2 9a2 2 0 0 1-1-3.73V11h2v1.27A2 2 0 0 1 12 16Z" />
        </svg>
        Change Password
      </h3>
      <p>Update your account password using your current password for verification.</p>

      <form className="admin-form-grid" onSubmit={handleSubmit}>
        <label>
          Current Password
          <div className="auth-password-field">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={(event) => setFormData((prev) => ({ ...prev, currentPassword: event.target.value }))}
              placeholder="Enter current password"
              minLength={6}
              required
            />
            <PasswordToggleButton isVisible={showCurrentPassword} onToggle={() => setShowCurrentPassword((prev) => !prev)} />
          </div>
        </label>

        <label>
          New Password
          <div className="auth-password-field">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={(event) => setFormData((prev) => ({ ...prev, newPassword: event.target.value }))}
              placeholder="Enter new password"
              minLength={6}
              required
            />
            <PasswordToggleButton isVisible={showNewPassword} onToggle={() => setShowNewPassword((prev) => !prev)} />
          </div>
        </label>

        <label>
          Confirm New Password
          <div className="auth-password-field">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(event) => setFormData((prev) => ({ ...prev, confirmPassword: event.target.value }))}
              placeholder="Re-enter new password"
              minLength={6}
              required
            />
            <PasswordToggleButton isVisible={showConfirmPassword} onToggle={() => setShowConfirmPassword((prev) => !prev)} />
          </div>
        </label>

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary admin-password-submit-btn" disabled={saving}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V7Zm2 9a2 2 0 0 1-1-3.73V11h2v1.27A2 2 0 0 1 12 16Z" />
            </svg>
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>

      {error ? <p className="admin-error">{error}</p> : null}
      {success ? <p className="admin-success">{success}</p> : null}
    </article>
  )
}

export default AdminChangePasswordPage
