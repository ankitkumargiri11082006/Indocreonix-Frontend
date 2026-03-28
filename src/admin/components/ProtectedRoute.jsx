import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getFirstAllowedAdminRoute, hasAdminPermission } from '../permissions'

function ProtectedRoute({ children, roles = [], permission }) {
  const { user, loading, isAuthenticated, refreshUser } = useAuth()
  const location = useLocation()
  const [permissionSyncing, setPermissionSyncing] = useState(false)
  const [permissionSynced, setPermissionSynced] = useState(false)

  const missingPermission = Boolean(permission) && isAuthenticated && !loading && !hasAdminPermission(user, permission)

  useEffect(() => {
    if (!missingPermission || permissionSynced) return

    let active = true
    setPermissionSyncing(true)

    refreshUser()
      .catch(() => {
        // Protected route fallback handles denied access if refresh still lacks permission.
      })
      .finally(() => {
        if (active) {
          setPermissionSyncing(false)
          setPermissionSynced(true)
        }
      })

    return () => {
      active = false
    }
  }, [missingPermission, permissionSynced, refreshUser])

  useEffect(() => {
    if (!missingPermission) {
      setPermissionSynced(false)
    }
  }, [missingPermission])

  if (loading) {
    return <div className="admin-loading-screen">Loading...</div>
  }

  if (permissionSyncing) {
    return <div className="admin-loading-screen">Refreshing access...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles.length && !roles.includes(user?.role)) {
    return <Navigate to="/admin" replace />
  }

  if (missingPermission) {
    const fallbackRoute = getFirstAllowedAdminRoute(user)
    if (fallbackRoute && fallbackRoute !== location.pathname) {
      return <Navigate to={fallbackRoute} replace />
    }

    return (
      <div className="admin-card wide">
        <h3>Access Restricted</h3>
        <p className="admin-muted">No modules are enabled for this account. Ask superadmin to enable section access.</p>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
