import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import authAPI from '@/api/authAPI'
import { adminAPI } from '@/api/index'
import useAuthStore from '@/store/useAuthStore'
import useCartStore from '@/store/useCartStore'

export function useLogin() {
  const [loading, setLoading] = useState(false)
  const setAuth   = useAuthStore((s) => s.setAuth)
  const navigate  = useNavigate()

  const login = async (data) => {
    setLoading(true)
    try {
      const res = await authAPI.login(data)
      setAuth(res.data.user, res.data.tokens, false)
      toast.success(`Welcome back, ${res.data.user.first_name}! 👋`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.non_field_errors?.[0] || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return { login, loading }
}

export function useRegister() {
  const [loading, setLoading] = useState(false)
  const setAuth  = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const register = async (data) => {
    setLoading(true)
    try {
      const res = await authAPI.register(data)
      setAuth(res.data.user, res.data.tokens, false)
      toast.success('Account created! Welcome 🎉')
      navigate('/login')
    } catch (err) {
      const errors = err.response?.data
      const msg = errors?.email?.[0] || errors?.password?.[0] || 'Registration failed.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return { register, loading }
}

export function useLogout() {
  const { tokens, logout } = useAuthStore()
  const clearItems = useCartStore((s) => s.clearItems)
  const navigate   = useNavigate()

  const handleLogout = async () => {
    try {
      await authAPI.logout({ refresh: tokens?.refresh })
    } catch (_) { /* ignore */ }
    logout()
    clearItems()
    toast.success('Logged out successfully.')
    navigate('/login')
  }

  return { handleLogout }
}

export function useAdminLogin() {
  const [loading, setLoading] = useState(false)
  const setAuth  = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const adminLogin = async (data) => {
    setLoading(true)
    try {
      const res = await adminAPI.login(data)
      setAuth({ first_name: 'Admin', email: res.data.admin_id }, res.data.tokens, true)
      toast.success('Admin login successful!')
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.non_field_errors?.[0] || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return { adminLogin, loading }
}
