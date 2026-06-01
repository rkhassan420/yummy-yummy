import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRegister } from '@/hooks/useAuth'

const schema = z.object({
  first_name: z.string().min(2, 'First name required'),
  last_name: z.string().optional(),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
  password2: z.string(),
}).refine((d) => d.password === d.password2, {
  message: "Passwords don't match",
  path: ['password2'],
})

export default function RegisterPage() {
  const { register: registerUser, loading } = useRegister()

  const { register, handleSubmit, formState: { errors } } =
    useForm({ resolver: zodResolver(schema) })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">

      {/* Left panel */}
      <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-navy-900 to-green-700
                      flex-col items-center justify-center p-12 text-center">

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
           {/* IMAGE instead of emoji */}
    <img
      src="/about.png"
      alt="Login Illustration"
      className="w-40 h-40 object-contain mx-auto mb-6"
    />

          <h1 className="font-display text-4xl font-semibold text-white mb-4">
            Join Us!
          </h1>

        <p className="text-black dark:text-white/80 text-lg leading-relaxed max-w-sm">
            Create your account and start enjoying the best food delivery experience.
          </p>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10
                      bg-gray-50 dark:bg-slate-900">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-200 dark:border-slate-700">

            {/* Title */}
            <h2 className="font-display text-3xl font-semibold text-black dark:text-white mb-2">
              Create Account
            </h2>

            <p className="text-gray-700 dark:text-gray-400 mb-8 text-sm">
              Fill in your details to get started
            </p>

            <form onSubmit={handleSubmit(registerUser)} className="space-y-4">

              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                    First Name *
                  </label>

                  <input
                    {...register('first_name')}
                    placeholder="Ali"
                    className="w-full px-4 py-3 rounded-xl border
                               border-gray-300 dark:border-slate-600
                               bg-white dark:bg-slate-900
                               text-black dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-green-500"
                  />

                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                    Last Name
                  </label>

                  <input
                    {...register('last_name')}
                    placeholder="Hassan"
                    className="w-full px-4 py-3 rounded-xl border
                               border-gray-300 dark:border-slate-600
                               bg-white dark:bg-slate-900
                               text-black dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                  Email *
                </label>

                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border
                             border-gray-300 dark:border-slate-600
                             bg-white dark:bg-slate-900
                             text-black dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                  Password *
                </label>

                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-3 rounded-xl border
                             border-gray-300 dark:border-slate-600
                             bg-white dark:bg-slate-900
                             text-black dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-gray-600 dark:text-gray-300 mt-1 hover:text-green-600"
                >
                  {showPassword ? 'Hide password' : 'Show password'}
                </button>

                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                  Confirm Password *
                </label>

                <input
                  {...register('password2')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat password"
                  className="w-full px-4 py-3 rounded-xl border
                             border-gray-300 dark:border-slate-600
                             bg-white dark:bg-slate-900
                             text-black dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-xs text-gray-600 dark:text-gray-300 mt-1 hover:text-green-600"
                >
                  {showConfirmPassword ? 'Hide password' : 'Show password'}
                </button>

                {errors.password2 && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password2.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-medium
                           bg-green-600 hover:bg-green-700
                           text-white transition-all duration-200
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Account →'}
              </button>

            </form>

            {/* Login link */}
            <p className="text-center text-sm text-gray-700 dark:text-gray-400 mt-6">
              Already have an account?{' '}
              <NavLink
                to="/login"
                className="text-green-600 dark:text-green-400 font-medium hover:underline"
              >
                Login here
              </NavLink>
            </p>

          </div>
        </motion.div>
      </div>
    </div>
  )
}