import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user:        null,
      tokens:      null,
      isLoggedIn:  false,
      isAdmin:     false,

      setAuth: (user, tokens, isAdmin = false) => {
        localStorage.setItem('yummy_tokens', JSON.stringify(tokens))
        set({ user, tokens, isLoggedIn: true, isAdmin })
      },

      updateUser: (userData) =>
        set((state) => ({ user: { ...state.user, ...userData } })),

      logout: () => {
        localStorage.removeItem('yummy_tokens')
        set({ user: null, tokens: null, isLoggedIn: false, isAdmin: false })
      },
    }),
    {
      name:    'yummy_auth',
      partialize: (state) => ({
        user:       state.user,
        tokens:     state.tokens,
        isLoggedIn: state.isLoggedIn,
        isAdmin:    state.isAdmin,
      }),
    }
  )
)

export default useAuthStore
