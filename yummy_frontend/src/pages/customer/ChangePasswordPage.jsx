import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { NavLink } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import authAPI from '@/api/authAPI'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const schema = z.object({
  old_password:     z.string().min(1, 'Current password is required'),
  new_password:     z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
})

export default function ChangePasswordPage() {
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ 
    resolver: zodResolver(schema) 
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => authAPI.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully! 🔐')
      reset()
      setShowOld(false)
      setShowNew(false)
      setShowConfirm(false)
    },
    onError: (e) => {
      const msg = e.response?.data?.old_password?.[0]
        || e.response?.data?.new_password?.[0]
        || 'Change password failed.'
      toast.error(msg)
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-navy-DEFAULT via-navy-DEFAULT to-green-dark
                      flex-col items-center justify-center p-12 text-center relative overflow-hidden">
        
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#ffffff15_0%,transparent_70%)]" />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className="relative z-10"
        >
          <div className="text-8xl mb-6">🔑</div>
          <h1 className="font-display text-4xl text-slate-900 dark:text-white mb-4">
            Change Password
          </h1>
          <p className="text-slate-600 dark:text-white/70 text-lg max-w-sm leading-relaxed">
            Keep your account secure with a strong, unique password.
          </p>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="card p-8 lg:p-10">
            <h2 className="font-display text-3xl text-navy-DEFAULT dark:text-white mb-2">
              Change Password
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Update your account password
            </p>

            <form onSubmit={handleSubmit(mutate)} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input 
                    {...register('old_password')} 
                    type={showOld ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="input-field pr-12" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.old_password && (
                  <p className="text-red-500 text-xs mt-1">{errors.old_password.message}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input 
                    {...register('new_password')} 
                    type={showNew ? "text" : "password"} 
                    placeholder="Minimum 6 characters" 
                    className="input-field pr-12" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.new_password && (
                  <p className="text-red-500 text-xs mt-1">{errors.new_password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input 
                    {...register('confirm_password')} 
                    type={showConfirm ? "text" : "password"} 
                    placeholder="Repeat new password" 
                    className="input-field pr-12" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isPending} 
                className="btn-primary w-full py-4 text-base font-medium"
              >
                {isPending ? 'Updating Password...' : 'Update Password →'}
              </button>
            </form>

            <div className="text-center mt-6">
              <NavLink 
                to="/profile" 
                className="text-sm text-green-DEFAULT hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                ← Back to Profile
              </NavLink>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}