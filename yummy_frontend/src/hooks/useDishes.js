import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import menuAPI from '@/api/menuAPI'

// ── Debounce ──────────────────────────────────────────────────────────────────
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

// ── Categories ────────────────────────────────────────────────────────────────
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn:  async () => {
      const res = await menuAPI.getCategories()
      return res.data.results || res.data
    },
    staleTime: 1000 * 60 * 10,
  })
}

// ── All Dishes (with filters) ─────────────────────────────────────────────────
export function useDishes(params = {}) {
  return useQuery({
    queryKey: ['dishes', params],
    queryFn:  async () => {
      const res = await menuAPI.getDishes(params)
      return res.data.results || res.data
    },
    staleTime: 1000 * 60 * 5,
  })
}

// ── Popular Dishes ────────────────────────────────────────────────────────────
export function usePopularDishes() {
  return useQuery({
    queryKey: ['popular'],
    queryFn:  async () => {
      const res = await menuAPI.getPopular()
      return res.data.results || res.data
    },
    staleTime: 1000 * 60 * 5,
  })
}
