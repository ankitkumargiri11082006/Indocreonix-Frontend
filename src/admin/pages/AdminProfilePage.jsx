import { useAuth } from '../../context/AuthContext'

function AdminProfilePage() {
  const { user } = useAuth()

  return (
    <article className="admin-card wide">
      <h3>Profile</h3>
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
