import axios from 'axios'
import { API_URL } from '@/utils/constants'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: attach JWT ──────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    try {
      const tokens = JSON.parse(localStorage.getItem('yummy_tokens') || '{}')
      if (tokens?.access) {
        config.headers.Authorization = `Bearer ${tokens.access}`
      }
    } catch (_) { /* ignore parse errors */ }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: refresh on 401 ─────────────────────────────────────
let isRefreshing = false
let failedQueue  = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)))
  failedQueue = []
}

const getTokens = () => {
  try { return JSON.parse(localStorage.getItem('yummy_tokens') || '{}') }
  catch { return {} }
}

const clearAuth = () => {
  localStorage.removeItem('yummy_tokens')
  localStorage.removeItem('yummy_auth')   // Zustand persisted store key
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status          = error.response?.status

    // ── Only attempt refresh on 401, and only if:
    //    1. We haven't already retried this request
    //    2. A refresh token actually exists
    //    3. The failing request is NOT itself the refresh endpoint
    const tokens       = getTokens()
    const isAuthRoute  = originalRequest?.url?.includes('/auth/token/refresh/')
                      || originalRequest?.url?.includes('/auth/login/')
                      || originalRequest?.url?.includes('/auth/register/')
                      || originalRequest?.url?.includes('/admin/login/')

    if (status === 401 && !originalRequest._retry && tokens?.refresh && !isAuthRoute) {

      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: tokens.refresh,
        })

        // Save new access token
        const newTokens = { ...tokens, access: data.access }
        localStorage.setItem('yummy_tokens', JSON.stringify(newTokens))

        // Update Zustand persisted store too
        try {
          const authStore = JSON.parse(localStorage.getItem('yummy_auth') || '{}')
          if (authStore?.state) {
            authStore.state.tokens = newTokens
            localStorage.setItem('yummy_auth', JSON.stringify(authStore))
          }
        } catch (_) { /* ignore */ }

        processQueue(null, data.access)
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return api(originalRequest)

      } catch (refreshError) {
        // Refresh token is expired/invalid — clear auth silently, no redirect loop
        processQueue(refreshError, null)
        clearAuth()

        // Only redirect if we're NOT already on an auth page
        const currentPath = window.location.pathname
        const isAuthPage  = ['/login', '/register', '/forgot-password',
                              '/admin/login'].includes(currentPath)
        if (!isAuthPage) {
          window.location.href = '/login'
        }

        return Promise.reject(refreshError)

      } finally {
        isRefreshing = false
      }
    }

    // For all other errors — just reject normally, no redirect
    return Promise.reject(error)
  }
)

export default api