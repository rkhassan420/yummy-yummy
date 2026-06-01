import { create } from 'zustand'

const useMenuStore = create((set) => ({
  activeCategory: 'All',
  searchQuery:    '',
  sortBy:         'default',
  favorites:      [],

  setCategory:  (cat)    => set({ activeCategory: cat }),
  setSearch:    (q)      => set({ searchQuery: q }),
  setSort:      (s)      => set({ sortBy: s }),

  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((f) => f !== id)
        : [...state.favorites, id],
    })),
}))

export default useMenuStore
