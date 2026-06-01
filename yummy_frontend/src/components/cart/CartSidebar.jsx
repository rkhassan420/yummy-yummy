import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, ShoppingBag, ChevronRight, Tag } from 'lucide-react'
import useCartStore from '@/store/useCartStore'
import useAuthStore from '@/store/useAuthStore'
import { useUpdateCartItem, useRemoveCartItem, useClearCart } from '@/hooks/useCart'
import CheckoutModal from './CheckoutModal'
import { DELIVERY_FEE } from '@/utils/constants'

export default function CartSidebar() {
  const { items, isOpen, closeCart } = useCartStore()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const navigate = useNavigate()

  const { mutate: updateItem } = useUpdateCartItem()
  const { mutate: removeItem } = useRemoveCartItem()
  const { mutate: clearCart }  = useClearCart()

  const subTotal   = items.reduce((s, i) => s + Number(i.price) * i.qty, 0)
  const delivery   = items.length > 0 ? DELIVERY_FEE : 0
  const grandTotal = subTotal + delivery

  const handleCheckout = () => {
    if (!isLoggedIn) { closeCart(); navigate('/login'); return }
    setCheckoutOpen(true)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1050]"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={closeCart}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-full max-w-[420px]
                       bg-white dark:bg-slate-900 z-[1051] flex flex-col shadow-2xl"
            initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
            transition={{ type:'spring', damping:32, stiffness:320 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5
                            border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-500/10 dark:bg-green-500/20 rounded-xl
                                flex items-center justify-center">
                  <ShoppingBag size={18} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="font-display text-lg text-slate-900 dark:text-white">My Cart</h2>
                  <p className="text-xs text-slate-400">
                    {items.reduce((s,i) => s + i.qty, 0)} items
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button onClick={() => clearCart()}
                    className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5
                               hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                    Clear all
                  </button>
                )}
                <button onClick={closeCart}
                  className="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800
                             flex items-center justify-center text-slate-400 transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-5 p-8 text-center">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-3xl
                                  flex items-center justify-center text-5xl">
                    🛒
                  </div>
                  <div>
                    <p className="font-display text-xl text-slate-900 dark:text-white mb-2">
                      Your cart is empty
                    </p>
                    <p className="text-slate-400 text-sm">Add some delicious items!</p>
                  </div>
                  <button onClick={() => { closeCart(); navigate('/menu') }}
                    className="btn-primary px-6 py-3 flex items-center gap-2">
                    Browse Menu <ChevronRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="p-5 space-y-3">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div key={item.id}
                        layout
                        initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                        exit={{ opacity:0, x:-20, height:0 }}
                        className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/60
                                   rounded-2xl border border-slate-100 dark:border-slate-700/50">

                        {/* Image */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200
                                        dark:bg-slate-700 flex-shrink-0">
                          {item.image
                            ? <img src={item.image} alt={item.name}
                                className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                          }
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white
                                        text-sm truncate mb-1">{item.name}</p>
                          <p className="text-green-600 dark:text-green-400 text-sm font-bold">
                            Rs. {(Number(item.price) * item.qty).toLocaleString()} /-
                          </p>
                          <p className="text-slate-400 text-xs mt-0.5">
                            Rs. {Number(item.price).toLocaleString()} each
                          </p>
                        </div>

                        {/* Qty + Delete */}
                        <div className="flex flex-col items-end gap-2">
                          <button onClick={() => removeItem(item.id)}
                            className="w-6 h-6 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20
                                       flex items-center justify-center text-slate-300
                                       hover:text-red-500 transition-colors">
                            <Trash2 size={12} />
                          </button>
                          <div className="flex items-center gap-2 bg-white dark:bg-slate-700
                                          rounded-xl border border-slate-200 dark:border-slate-600
                                          px-2 py-1">
                            <button onClick={() => updateItem({ id:item.id, qty: Math.max(1, item.qty-1) })}
                              className="w-5 h-5 flex items-center justify-center text-slate-400
                                         hover:text-green-600 font-bold transition-colors text-base">−</button>
                            <span className="text-sm font-bold text-slate-900 dark:text-white w-4 text-center">
                              {item.qty}
                            </span>
                            <button onClick={() => updateItem({ id:item.id, qty: item.qty+1 })}
                              className="w-5 h-5 flex items-center justify-center text-slate-400
                                         hover:text-green-600 font-bold transition-colors text-base">+</button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800">
                {/* Promo */}
                <div className="flex items-center gap-3 bg-green-50 dark:bg-green-500/10
                                rounded-xl p-3 mb-4 border border-green-100 dark:border-green-500/20">
                  <Tag size={14} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                  <p className="text-xs text-green-700 dark:text-green-400">
                    Free delivery on orders over <strong>Rs. 1,500</strong>
                  </p>
                </div>

                {/* Summary */}
                <div className="space-y-2.5 mb-4">
                  {[
                    ['Sub-Total',    `Rs. ${subTotal.toLocaleString()} /-`],
                    ['Delivery Fee', `Rs. ${delivery} /-`],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">{label}</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-base pt-3
                                  border-t border-slate-100 dark:border-slate-700">
                    <span className="text-slate-900 dark:text-white">Grand Total</span>
                    <span className="text-green-600 dark:text-green-400 text-lg">
                      Rs. {grandTotal.toLocaleString()} /-
                    </span>
                  </div>
                </div>

                <button onClick={handleCheckout}
                  className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2">
                  Proceed to Checkout <ChevronRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} grandTotal={grandTotal} />
    </AnimatePresence>
  )
}