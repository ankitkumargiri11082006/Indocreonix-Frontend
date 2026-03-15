import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getFirstAllowedAdminRoute, hasAdminPermission } from '../permissions'

function ProtectedRoute({ children, roles = [], permission }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="admin-loading-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles.length && !roles.includes(user?.role)) {
    return <Navigate to="/admin" replace />
  }

  if (!hasAdminPermission(user, permission)) {
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
