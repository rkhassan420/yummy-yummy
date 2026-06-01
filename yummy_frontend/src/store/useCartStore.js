import { create } from 'zustand'
import { DELIVERY_FEE } from '@/utils/constants'

const useCartStore = create((set, get) => ({
  items:       [],
  isOpen:      false,
  isLoading:   false,

  // Derived
  get cartCount()  { return get().items.reduce((s, i) => s + i.qty, 0) },
  get subTotal()   { return get().items.reduce((s, i) => s + i.price * i.qty, 0) },
  get deliveryFee(){ return get().items.length > 0 ? DELIVERY_FEE : 0 },
  get grandTotal() { return get().subTotal + get().deliveryFee },

  // Sync cart from API response
  setCart: (cartData) => {
    if (!cartData) return
    set({ items: cartData.items || [] })
  },

  // Optimistic local add (before API confirms)
  localAddItem: (dish) => {
    set((state) => {
      const existing = state.items.find(
        (i) => i.dish_id === dish.id || i.name === dish.name
      )
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === existing.id ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return {
        items: [
          ...state.items,
          {
            id:        Date.now(),
            dish_id:   dish.id,
            name:      dish.name,
            image:     dish.image_url || dish.image || '',
            price:     Number(dish.price),
            qty:       1,
          },
        ],
      }
    })
  },

  localUpdateQty: (id, qty) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
    })),

  localRemoveItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  clearItems: () => set({ items: [] }),
  openCart:   () => set({ isOpen: true }),
  closeCart:  () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
}))

export default useCartStore
