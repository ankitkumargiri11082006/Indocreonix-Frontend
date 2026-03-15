import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children, roles = [] }) {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return <div className="admin-loading-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles.length && !roles.includes(user?.role)) {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default ProtectedRoute
