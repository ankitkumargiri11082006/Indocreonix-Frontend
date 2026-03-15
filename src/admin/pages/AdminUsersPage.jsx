import { useEffect, useState } from 'react'
import { apiRequest } from '../../lib/apiClient'

function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  async function loadUsers() {
    try {
      const result = await apiRequest('/users')
      setUsers(result.users || [])
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  async function toggleStatus(user) {
    try {
      await apiRequest(`/users/${user._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !user.isActive }),
      })
      loadUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <article className="admin-card wide">
      <h3>User Management</h3>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isActive ? 'Active' : 'Disabled'}</td>
                <td>
                  <button type="button" className="btn btn-secondary" onClick={() => toggleStatus(user)}>
                    {user.isActive ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}

export default AdminUsersPage
