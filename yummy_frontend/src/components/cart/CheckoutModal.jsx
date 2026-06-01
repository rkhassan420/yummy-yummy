import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle, Smartphone, Banknote, ChevronRight,
  Shield, Clock, MapPin, X, Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/api/axiosInstance'
import useCartStore from '@/store/useCartStore'
import useAuthStore from '@/store/useAuthStore'
import { formatCurrency } from '@/utils/formatters'
import { DELIVERY_FEE } from '@/utils/constants'

// ─── API helpers ──────────────────────────────────────────────────────────────
const initJazzCash  = (data) => api.post('/payments/initiate/',            data)
const initEasyPaisa = (data) => api.post('/payments/easypaisa/initiate/',  data)
const placeCOD      = (data) => api.post('/payments/cod/',                 data)

// ─── POST-form redirect helper ────────────────────────────────────────────────
function submitPaymentForm(paymentUrl, params) {
  const form = document.createElement('form')
  form.method       = 'POST'
  form.action       = paymentUrl
  form.style.display = 'none'
  Object.entries(params).forEach(([key, value]) => {
    const input  = document.createElement('input')
    input.type   = 'hidden'
    input.name   = key
    input.value  = value
    form.appendChild(input)
  })
  document.body.appendChild(form)
  form.submit()
}

// ─── Step labels ──────────────────────────────────────────────────────────────
const STEPS = ['Method', 'Details', 'Confirm']

// ─── Component ────────────────────────────────────────────────────────────────
export default function CheckoutModal({ isOpen, onClose, grandTotal }) {
  const user                    = useAuthStore((s) => s.user)
  const { items, closeCart, clearItems } = useCartStore()
  const qc                      = useQueryClient()

  const [step,    setStep]    = useState(0)   // 0=method  1=details  2=confirm
  const [method,  setMethod]  = useState('')  // 'jazzcash' | 'easypaisa' | 'cod'
  const [address, setAddress] = useState(user?.address || '')
  const [mobile,  setMobile]  = useState(user?.cnumber || '')

  const subTotal = items.reduce((s, i) => s + Number(i.price) * i.qty, 0)

  const reset        = () => { setStep(0); setMethod('') }
  const handleClose  = () => { onClose(); reset() }

  // ── COD ───────────────────────────────────────────────────────────────────
  const { mutate: placeCODOrder, isPending: codPending } = useMutation({
    mutationFn: () => placeCOD({ address }),
    onSuccess: () => {
      clearItems()
      qc.invalidateQueries({ queryKey: ['cart']   })
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Order placed! Pay on delivery 🎉')
      handleClose()
      closeCart()
    },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to place order.'),
  })

  // ── JazzCash — step 2: initiate payment with order id ─────────────────────
  const { mutate: initiateJC, isPending: jcPending } = useMutation({
    mutationFn: (orderId) =>
      initJazzCash({ order_id: orderId, mobile_number: mobile }),
    onSuccess: (res) => {
      const { payment_url, params } = res.data
      toast('Redirecting to JazzCash... 🔄', { icon: '📱' })
      setTimeout(() => submitPaymentForm(payment_url, params), 800)
    },
    onError: (e) => toast.error(e.response?.data?.error || 'JazzCash initiation failed.'),
  })

  // ── EasyPaisa — step 2: initiate payment with order id ────────────────────
  const { mutate: initiateEP, isPending: epPending } = useMutation({
    mutationFn: (orderId) =>
      initEasyPaisa({ order_id: orderId, mobile_number: mobile }),
    onSuccess: (res) => {
      const { payment_url, params } = res.data
      toast('Redirecting to EasyPaisa... 🔄', { icon: '💚' })
      setTimeout(() => submitPaymentForm(payment_url, params), 800)
    },
    onError: (e) => toast.error(e.response?.data?.error || 'EasyPaisa initiation failed.'),
  })

  // ── Create order first, then redirect to payment gateway ──────────────────
  const { mutate: createOrderForPayment, isPending: createPending } = useMutation({
    mutationFn: () => api.post('/orders/place/', { address }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['cart'] })
      clearItems()
      const orderId = res.data.order.id
      if (method === 'jazzcash')  initiateJC(orderId)
      if (method === 'easypaisa') initiateEP(orderId)
    },
    onError: (e) => toast.error(e.response?.data?.error || 'Could not create order.'),
  })

  const handleConfirm = () => {
    if (!address.trim() || address.length < 10) {
      toast.error('Please enter a valid delivery address')
      return
    }
    if (method === 'cod') {
      placeCODOrder()
    } else {
      createOrderForPayment()
    }
  }

  const isPending    = codPending || jcPending || epPending || createPending
  const needsMobile  = method === 'jazzcash' || method === 'easypaisa'
  const gatewayLabel = method === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'
  const gatewayColor = method === 'jazzcash'
    ? 'from-red-500 to-red-600 shadow-red-500/20'
    : 'from-green-500 to-green-600 shadow-green-500/20'
  const gatewayBtnClass = method === 'jazzcash'
    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20'
    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/20'

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1300] flex items-end sm:items-center justify-center p-4">

        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-lg bg-white dark:bg-slate-900
                     rounded-2xl shadow-2xl overflow-hidden z-10"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 40, scale: 0.97  }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5
                          border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="font-display text-xl text-slate-900 dark:text-white">
                Checkout
              </h2>
              {/* Step indicator */}
              <div className="flex items-center gap-2 mt-1.5">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center
                                    text-[10px] font-bold transition-all duration-200 ${
                      i < step   ? 'bg-green-500 text-white'
                    : i === step ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                 : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                    }`}>
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs font-medium ${
                      i === step ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                    }`}>{s}</span>
                    {i < STEPS.length - 1 && (
                      <ChevronRight size={10} className="text-slate-300 dark:text-slate-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center
                         justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700
                         transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">

            {/* ── STEP 0: Choose payment method ───────────────────────────── */}
            {step === 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                  Choose your payment method
                </p>

                {/* JazzCash */}
<button
  disabled
  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2
              transition-all duration-200 text-left
              border-slate-200 dark:border-slate-700
              opacity-50 cursor-not-allowed`}
>
  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600
                  flex items-center justify-center flex-shrink-0 shadow-md shadow-red-500/20">
    <Smartphone size={24} className="text-white" />
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2 mb-1">
      <p className="font-semibold text-slate-900 dark:text-white">JazzCash</p>
      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100
                       dark:bg-slate-700 text-slate-500 rounded-full">
        COMING SOON
      </span>
    </div>
    <p className="text-xs text-slate-400">Pay via JazzCash Mobile Account</p>
  </div>
</button>

{/* EasyPaisa */}
<button
  disabled
  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2
              transition-all duration-200 text-left
              border-slate-200 dark:border-slate-700
              opacity-50 cursor-not-allowed`}
>
  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600
                  flex items-center justify-center flex-shrink-0 shadow-md shadow-green-500/20">
    <Smartphone size={24} className="text-white" />
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2 mb-1">
      <p className="font-semibold text-slate-900 dark:text-white">EasyPaisa</p>
      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100
                       dark:bg-slate-700 text-slate-500 rounded-full">
        COMING SOON
      </span>
    </div>
    <p className="text-xs text-slate-400">Pay via EasyPaisa Mobile Account</p>
  </div>
</button>

                {/* JazzCash */}
                {/* <button
                  onClick={() => { setMethod('jazzcash'); setStep(1) }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2
                              transition-all duration-200 text-left group
                              hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 ${
                    method === 'jazzcash'
                      ? 'border-red-500 bg-red-50 dark:bg-red-500/10'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600
                                  flex items-center justify-center flex-shrink-0 shadow-md
                                  shadow-red-500/20">
                    <Smartphone size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-900 dark:text-white">JazzCash</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100
                                       dark:bg-red-500/20 text-red-700 dark:text-red-400
                                       rounded-full">RECOMMENDED</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Pay securely via JazzCash Mobile Account
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Shield size={10} className="text-green-500" /> Secure
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock size={10} className="text-blue-500" /> Instant
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-red-500
                                                     transition-colors flex-shrink-0" />
                </button>

                
                <button
                  onClick={() => { setMethod('easypaisa'); setStep(1) }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2
                              transition-all duration-200 text-left group
                              hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-500/5 ${
                    method === 'easypaisa'
                      ? 'border-green-500 bg-green-50 dark:bg-green-500/10'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600
                                  flex items-center justify-center flex-shrink-0 shadow-md
                                  shadow-green-500/20">
                    <Smartphone size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-900 dark:text-white">EasyPaisa</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100
                                       dark:bg-green-500/20 text-green-700 dark:text-green-400
                                       rounded-full">POPULAR</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Pay securely via EasyPaisa Mobile Account
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Shield size={10} className="text-green-500" /> Secure
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock size={10} className="text-blue-500" /> Instant
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-green-500
                                                     transition-colors flex-shrink-0" />
                </button> */}

                {/* Cash on Delivery */}
                <button
                  onClick={() => { setMethod('cod'); setStep(1) }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2
                              transition-all duration-200 text-left group
                              hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                    method === 'cod'
                      ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900
                                  flex items-center justify-center flex-shrink-0 shadow-md">
                    <Banknote size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white mb-1">
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Pay in cash when your order arrives
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Banknote size={10} className="text-slate-400" /> No card needed
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-600
                                                     transition-colors flex-shrink-0" />
                </button>
              </div>
            )}

            {/* ── STEP 1: Delivery details ─────────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Enter delivery details
                </p>

                {/* Address */}
                <div>
                  <label className="block text-xs font-medium text-slate-600
                                     dark:text-slate-400 mb-1.5">
                    <MapPin size={11} className="inline mr-1" />
                    Delivery Address *
                  </label>
                  <textarea
                    className="input-field resize-none text-sm"
                    rows={3}
                    placeholder="Enter your full delivery address (house no, street, area, city)..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                {/* Mobile number — only for JazzCash / EasyPaisa */}
                {needsMobile && (
                  <div>
                    <label className="block text-xs font-medium text-slate-600
                                       dark:text-slate-400 mb-1.5">
                      <Smartphone size={11} className="inline mr-1" />
                      {gatewayLabel} Mobile Number *
                    </label>
                    <input
                      className="input-field text-sm font-mono"
                      placeholder="03001234567"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      maxLength={11}
                      type="tel"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Must be registered with {gatewayLabel}
                    </p>
                    {mobile && !mobile.match(/^03\d{9}$/) && (
                      <p className="text-[11px] text-red-500 mt-1">
                        Enter a valid 11-digit number (03XXXXXXXXX)
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={() => {
                    if (!address.trim() || address.length < 10) {
                      toast.error('Please enter a valid delivery address')
                      return
                    }
                    if (needsMobile && !mobile.match(/^03\d{9}$/)) {
                      toast.error(`Please enter a valid ${gatewayLabel} number`)
                      return
                    }
                    setStep(2)
                  }}
                  className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={16} />
                </button>

                <button
                  onClick={() => setStep(0)}
                  className="w-full text-sm text-slate-500 hover:text-slate-700
                             dark:hover:text-slate-300 transition-colors py-1"
                >
                  ← Back
                </button>
              </div>
            )}

            {/* ── STEP 2: Confirm order ────────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-4">

                {/* Method badge */}
                <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                  method === 'jazzcash'
                    ? 'bg-red-50   dark:bg-red-500/10   border-red-100   dark:border-red-500/20'
                  : method === 'easypaisa'
                    ? 'bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-700'
                }`}>
                  {method === 'cod'
                    ? <Banknote   size={18} className="text-slate-600 dark:text-slate-400 flex-shrink-0" />
                    : <Smartphone size={18} className={`flex-shrink-0 ${
                        method === 'jazzcash' ? 'text-red-500' : 'text-green-500'
                      }`} />
                  }
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {method === 'jazzcash'  ? 'JazzCash Payment'
                     : method === 'easypaisa' ? 'EasyPaisa Payment'
                                              : 'Cash on Delivery'}
                    </p>
                    {needsMobile && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        You'll be redirected to {gatewayLabel} to complete payment
                      </p>
                    )}
                  </div>
                </div>

                {/* Order summary */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Order Summary
                  </p>
                  {items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300 truncate mr-2">
                        {item.name} ×{item.qty}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium flex-shrink-0">
                        Rs. {(Number(item.price) * item.qty).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-xs text-slate-400">+{items.length - 3} more items</p>
                  )}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2 space-y-1.5">
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>Sub-Total</span>
                      <span>Rs. {subTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>Delivery Fee</span>
                      <span>Rs. {DELIVERY_FEE}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base
                                    text-slate-900 dark:text-white pt-1
                                    border-t border-slate-200 dark:border-slate-700">
                      <span>Grand Total</span>
                      <span className="text-green-600 dark:text-green-400">
                        {formatCurrency(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery address */}
                <div className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0 text-slate-400" />
                  <span className="leading-relaxed">{address}</span>
                </div>

                {/* Confirm button */}
                <button
                  onClick={handleConfirm}
                  disabled={isPending}
                  className={`w-full py-4 rounded-xl font-bold text-base flex items-center
                              justify-center gap-2 transition-all duration-200 text-white
                              disabled:opacity-60 disabled:cursor-not-allowed ${
                    needsMobile
                      ? gatewayBtnClass
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700'
                  }`}
                >
                  {isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {method === 'cod' ? 'Placing Order...' : `Connecting to ${gatewayLabel}...`}
                    </>
                  ) : method === 'cod' ? (
                    <><CheckCircle size={18} /> Place Order (COD)</>
                  ) : (
                    <><Smartphone size={18} /> Pay with {gatewayLabel}</>
                  )}
                </button>

                <button
                  onClick={() => setStep(1)}
                  className="w-full text-sm text-slate-500 hover:text-slate-700
                             dark:hover:text-slate-300 transition-colors py-1"
                >
                  ← Back
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}