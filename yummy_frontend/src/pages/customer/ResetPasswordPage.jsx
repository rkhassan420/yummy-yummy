import { useState, useRef } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import authAPI from '@/api/authAPI'

export default function ResetPasswordPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const email     = location.state?.email || ''

  const [otp, setOtp]         = useState(Array(6).fill(''))
  const [passwords, setPasswords] = useState({ new_password: '', confirm_password: '' })
  const inputs = useRef([])

  // ── OTP box handlers ──────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return          // digits only
    const next = [...otp]
    next[index] = value.slice(-1)             // one digit per box
    setOtp(next)
    if (value && index < 5) inputs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      inputs.current[index - 1]?.focus()
  }

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = [...otp]
    pasted.split('').forEach((d, i) => { next[i] = d })
    setOtp(next)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
    e.preventDefault()
  }

  // ── Mutation ──────────────────────────────────────────────────────
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      authAPI.resetPassword({
        token:            otp.join(''),
        new_password:     passwords.new_password,
        confirm_password: passwords.confirm_password,
      }),
    onSuccess: () => {
      toast.success('Password reset successfully! 🎉')
      navigate('/login')
    },
    onError: (e) => {
      const err = e.response?.data
      toast.error(err?.error || err?.new_password?.[0] || 'Something went wrong.')
    },
  })

  const isValid =
    otp.every(Boolean) &&
    passwords.new_password.length >= 6 &&
    passwords.confirm_password.length >= 1

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">

      {/* Left Panel */}
      <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-navy-900 to-green-700 flex-col items-center justify-center p-12 text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src="/about.png" alt="Reset Password" className="w-48 h-48 object-contain mx-auto mb-6" />
          <h1 className="font-display text-4xl font-semibold text-white mb-4">Check Your Email</h1>
          <p className="text-black dark:text-white/80 text-lg max-w-sm leading-relaxed">
            Enter the 6-digit OTP we sent to your email along with your new password.
          </p>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gray-50 dark:bg-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8 sm:p-10">

            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🔐</div>
              <h2 className="font-display text-3xl font-semibold text-black dark:text-white mb-1">
                Enter OTP
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                We sent a 6-digit code to
              </p>
              {email && (
                <p className="text-green-600 dark:text-green-400 text-sm font-medium mt-1">
                  {email}
                </p>
              )}
            </div>

            <div className="space-y-6">

              {/* OTP Boxes */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-300 mb-3 text-center">
                  Enter OTP
                </label>
                <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="
                        w-12 h-14 text-center text-xl font-bold rounded-xl border-2
                        border-gray-300 dark:border-slate-600
                        bg-white dark:bg-slate-900
                        text-black dark:text-white
                        focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20
                        transition-all duration-150
                      "
                    />
                  ))}
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={passwords.new_password}
                  onChange={(e) => setPasswords(p => ({ ...p, new_password: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={passwords.confirm_password}
                  onChange={(e) => setPasswords(p => ({ ...p, confirm_password: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Submit */}
              <button
                onClick={() => mutate()}
                disabled={isPending || !isValid}
                className="w-full py-3.5 rounded-xl font-medium bg-green-600 hover:bg-green-700 text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? 'Resetting...' : 'Reset Password →'}
              </button>

              <div className="text-center">
                <NavLink to="/login" className="text-sm text-green-600 dark:text-green-400 hover:underline">
                  ← Back to Login
                </NavLink>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}