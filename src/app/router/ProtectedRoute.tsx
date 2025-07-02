import { useLocation, Navigate } from 'react-router'
import DashboardLayout from '../layout/DashboardLayout'
import SignUpPage from '../features/auth/pages/SignUpPage'
import LoginPage from '../features/auth/pages/LoginPage'
import { useAppStore } from '../store/store'

export const ProtectedRoute = () => {
  const token = useAppStore((state) => state.auth.token)
  const isAuthenticated = !!token

  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <DashboardLayout />
}

export const SignupRedirect = () => {
  const token = useAppStore((state) => state.auth.token)
  const isAuthenticated = !!token

  const location = useLocation()
  const from = location.state?.from?.pathname || '/find-your-parking'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  return <SignUpPage />
}

export const LoginRedirect = () => {
  const token = useAppStore((state) => state.auth.token)
  const isAuthenticated = !!token

  const location = useLocation()
  const from = location.state?.from?.pathname || '/find-your-parking'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  return <LoginPage />
}
