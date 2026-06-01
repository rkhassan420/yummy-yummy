import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore'

export function ProtectedRoute() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />
}

export function AdminRoute() {
  const { isLoggedIn, isAdmin } = useAuthStore()
  if (!isLoggedIn) return <Navigate to="/admin/login" replace />
  if (!isAdmin)    return <Navigate to="/" replace />
  return <Outlet />
}

export function GuestRoute() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />
}
