import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute component for routes that require authentication
 * Redirects to login if user is not authenticated
 */
export default function ProtectedRoute({ element: Element, ...rest }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Element {...rest} />
}
