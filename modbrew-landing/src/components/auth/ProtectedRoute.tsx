import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  if (requireAuth && !user) {
    // Redirect to auth page with return url
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  if (!requireAuth && user) {
    // Redirect authenticated users away from auth pages
    return <Navigate to="/member-hub" replace />
  }

  return <>{children}</>
}
