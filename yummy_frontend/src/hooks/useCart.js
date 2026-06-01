import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import cartAPI from '@/api/cartAPI'
import useCartStore from '@/store/useCartStore'
import useAuthStore from '@/store/useAuthStore'

export function useCartQuery() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const setCart    = useCartStore((s) => s.setCart)

  return useQuery({
    queryKey: ['cart'],
    queryFn:  async () => {
      const res = await cartAPI.getCart()
      setCart(res.data)
      return res.data
    },
    enabled: isLoggedIn,
    staleTime: 1000 * 30,
  })
}

export function useAddToCart() {
  const qc          = useQueryClient()
  const isLoggedIn  = useAuthStore((s) => s.isLoggedIn)
  const localAdd    = useCartStore((s) => s.localAddItem)
  const openCart    = useCartStore((s) => s.openCart)

  return useMutation({
    mutationFn: (dish) => {
      if (!isLoggedIn) throw new Error('LOGIN_REQUIRED')
      return cartAPI.addItem({
        dish_id: dish.id,
        name:    dish.name,
        image:   dish.image_url || dish.image || '',
        price:   dish.price,
      })
    },
    onMutate: (dish) => {
      if (isLoggedIn) localAdd(dish)
    },
    onSuccess: (res) => {
      useCartStore.getState().setCart(res.data.cart)
      qc.invalidateQueries({ queryKey: ['cart'] })
      toast.success(`Added to cart! 🛒`)
      openCart()
    },
    onError: (err) => {
      if (err.message === 'LOGIN_REQUIRED') {
        toast.error('Please login to add items to cart.')
        return
      }
      toast.error('Could not add to cart.')
    },
  })
}

export function useUpdateCartItem() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, qty }) => cartAPI.updateItem(id, qty),
    onSuccess: (res) => {
      useCartStore.getState().setCart(res.data.cart)
      qc.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: () => toast.error('Could not update quantity.'),
  })
}

export function useRemoveCartItem() {
  const qc         = useQueryClient()
  const localRemove = useCartStore((s) => s.localRemoveItem)

  return useMutation({
    mutationFn: (id) => cartAPI.removeItem(id),
    onMutate:   (id) => localRemove(id),
    onSuccess: (res) => {
      useCartStore.getState().setCart(res.data.cart)
      qc.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Item removed.')
    },
    onError: () => toast.error('Could not remove item.'),
  })
}

export function useClearCart() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => cartAPI.clearCart(),
    onSuccess: () => {
      useCartStore.getState().clearItems()
      qc.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}
