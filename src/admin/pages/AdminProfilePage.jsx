import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { apiRequest } from '../../lib/apiClient'
import { adminPath } from '../adminPath'

function AdminProfilePage() {
  const { user, setCurrentUser } = useAuth()
  const [avatarFile, setAvatarFile] = useState(null)
  const [isEditingAvatar, setIsEditingAvatar] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const previewUrl = useMemo(() => {
    if (avatarFile) {
      return URL.createObjectURL(avatarFile)
    }
    return user?.avatarUrl || '/logo.png'
  }, [avatarFile, user?.avatarUrl])

  async function handleAvatarUpload(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!avatarFile) {
      setError('Please choose an image first')
      return
    }

    const body = new FormData()
    body.append('avatar', avatarFile)

    try {
      setUploading(true)
      const result = await apiRequest('/users/me/avatar', {
        method: 'PATCH',
        body,
      })

      setCurrentUser(result.user)
      setSuccess('Profile picture updated successfully')
      setAvatarFile(null)
      setIsEditingAvatar(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <article className="admin-card wide">
      <h3>Profile</h3>
      <div className="admin-profile-avatar-section">
        <div className="admin-profile-avatar-wrap">
          <img
            src={previewUrl}
            alt="Admin profile"
            className="admin-profile-avatar"
            onError={(event) => {
              if (event.currentTarget.dataset.fallbackApplied) return
              event.currentTarget.dataset.fallbackApplied = 'true'
              event.currentTarget.src = '/logo.png'
            }}
          />
        </div>

        <div className="admin-profile-avatar-form">
          <div className="admin-form-actions admin-profile-edit-actions">
            <Link to={adminPath('change-password')} className="btn btn-primary admin-profile-password-btn">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V7Zm2 9a2 2 0 0 1-1-3.73V11h2v1.27A2 2 0 0 1 12 16Z" />
              </svg>
              Change Password
            </Link>
            {!isEditingAvatar ? (
              <button
                type="button"
                className="btn btn-secondary admin-profile-edit-btn"
                onClick={() => {
                  setError('')
                  setSuccess('')
                  setIsEditingAvatar(true)
                }}
              >
                Edit
              </button>
            ) : null}
          </div>

          {isEditingAvatar ? (
            <form onSubmit={handleAvatarUpload}>
              <label className="admin-upload-field">
                Upload / Replace Profile Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setAvatarFile(event.target.files?.[0] || null)}
                />
                <small>Allowed: image files up to 2MB. Replacing image updates Cloudinary as well.</small>
              </label>
              <div className="admin-form-actions" style={{ marginTop: '0.6rem' }}>
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                  {uploading ? 'Updating...' : 'Update Profile Picture'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setAvatarFile(null)
                    setError('')
                    setIsEditingAvatar(false)
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : null}

          {error ? <p className="admin-error">{error}</p> : null}
          {success ? <p className="admin-success">{success}</p> : null}
        </div>
      </div>

      <div className="admin-profile-grid">
        <div>
          <p>Name</p>
          <strong>{user?.name}</strong>
        </div>
        <div>
          <p>Email</p>
          <strong>{user?.email}</strong>
        </div>
        <div>
          <p>Role</p>
          <strong>{user?.role}</strong>
        </div>
        <div>
          <p>Last Login</p>
          <strong>{user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'First login'}</strong>
        </div>
      </div>
    </article>
  )
}

export default AdminProfilePage
