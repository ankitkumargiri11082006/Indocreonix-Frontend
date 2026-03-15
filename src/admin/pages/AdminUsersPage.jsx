import { Fragment, useEffect, useState } from 'react'
import { apiRequest } from '../../lib/apiClient'
import { useAuth } from '../../context/AuthContext'

const permissionOptions = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'auditLogs', label: 'Audit Logs' },
  { key: 'projects', label: 'Projects' },
  { key: 'clients', label: 'Clients' },
  { key: 'services', label: 'Services' },
  { key: 'content', label: 'Content' },
  { key: 'media', label: 'Media' },
  { key: 'leads', label: 'Leads' },
  { key: 'openings', label: 'Openings' },
  { key: 'applications', label: 'Applications' },
  { key: 'users', label: 'Users' },
  { key: 'integrations', label: 'Integrations' },
  { key: 'settings', label: 'Settings' },
  { key: 'profile', label: 'Profile' },
]

function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [expandedPermissionsUserId, setExpandedPermissionsUserId] = useState('')
  const [error, setError] = useState('')
  const [loadingPermissionKey, setLoadingPermissionKey] = useState('')

  const isSuperadmin = currentUser?.role === 'superadmin'

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
    if (!isSuperadmin) return

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

  async function togglePermission(targetUser, permissionKey) {
    if (!isSuperadmin || targetUser.role !== 'admin') return

    const nextValue = !Boolean(targetUser.permissions?.[permissionKey])
    const nextPermissions = {
      ...(targetUser.permissions || {}),
      [permissionKey]: nextValue,
    }

    const loadingKey = `${targetUser._id}:${permissionKey}`

    setLoadingPermissionKey(loadingKey)
    setError('')

    try {
      await apiRequest(`/users/${targetUser._id}/permissions`, {
        method: 'PATCH',
        body: JSON.stringify({ permissions: nextPermissions }),
      })

      setUsers((previous) =>
        previous.map((user) =>
          user._id === targetUser._id
            ? {
                ...user,
                permissions: nextPermissions,
              }
            : user,
        ),
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingPermissionKey('')
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <Fragment key={user._id}>
                <tr>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isActive ? 'Active' : 'Disabled'}</td>
                  <td>
                    <div className="admin-action-group">
                      {isSuperadmin ? (
                        <button type="button" className="btn btn-secondary" onClick={() => toggleStatus(user)}>
                          {user.isActive ? 'Disable' : 'Enable'}
                        </button>
                      ) : null}

                      {isSuperadmin && user.role === 'admin' ? (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() =>
                            setExpandedPermissionsUserId((previous) => (previous === user._id ? '' : user._id))
                          }
                        >
                          {expandedPermissionsUserId === user._id ? 'Hide Access' : 'Manage Access'}
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>

                {isSuperadmin && user.role === 'admin' && expandedPermissionsUserId === user._id ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="admin-user-permissions-grid">
                        {permissionOptions.map((permission) => {
                          const controlId = `${user._id}-${permission.key}`
                          const loadingKey = `${user._id}:${permission.key}`

                          return (
                            <label htmlFor={controlId} key={permission.key} className="admin-permission-toggle">
                              <span>{permission.label}</span>
                              <input
                                id={controlId}
                                type="checkbox"
                                checked={Boolean(user.permissions?.[permission.key])}
                                disabled={loadingPermissionKey === loadingKey}
                                onChange={() => togglePermission(user, permission.key)}
                              />
                            </label>
                          )
                        })}
                      </div>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}

export default AdminUsersPage
