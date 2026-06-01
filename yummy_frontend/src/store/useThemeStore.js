import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: false,
      toggle: () => {
        const next = !get().isDark
        document.documentElement.classList.toggle('dark', next)
        set({ isDark: next })
      },
      init: () => {
        const { isDark } = get()
        document.documentElement.classList.toggle('dark', isDark)
      },
    }),
    { name: 'yummy_theme' }
  )
)

export default useThemeStore
