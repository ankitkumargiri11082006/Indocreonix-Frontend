import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiRequest } from '../../lib/apiClient'

function AdminProfilePage() {
  const { user, setCurrentUser } = useAuth()
  const [avatarFile, setAvatarFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const previewUrl = useMemo(() => {
    if (avatarFile) {
      return URL.createObjectURL(avatarFile)
    }
    return user?.avatarUrl || ''
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
          {previewUrl ? (
            <img src={previewUrl} alt="Admin profile" className="admin-profile-avatar" />
          ) : (
            <div className="admin-profile-avatar-fallback">{user?.name?.trim()?.[0]?.toUpperCase() || 'A'}</div>
          )}
        </div>

        <form className="admin-profile-avatar-form" onSubmit={handleAvatarUpload}>
          <label className="admin-upload-field">
            Upload / Replace Profile Picture
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setAvatarFile(event.target.files?.[0] || null)}
            />
            <small>Allowed: image files up to 2MB. Replacing image updates Cloudinary as well.</small>
          </label>
          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? 'Updating...' : 'Update Profile Picture'}
            </button>
          </div>
          {error ? <p className="admin-error">{error}</p> : null}
          {success ? <p className="admin-success">{success}</p> : null}
        </form>
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
