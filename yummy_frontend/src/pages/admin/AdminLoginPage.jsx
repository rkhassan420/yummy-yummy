import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAdminLogin } from '@/hooks/useAuth'

export default function AdminLoginPage() {
  const { adminLogin, loading } = useAdminLogin()
  const { register, handleSubmit } = useForm()

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gray-50 dark:bg-slate-950 p-4">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >

        {/* Card */}
        <div className="bg-white dark:bg-slate-800
                        rounded-2xl shadow-xl
                        border border-gray-200 dark:border-slate-700
                        p-8 sm:p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">⚙️</div>

            <h1 className="font-display text-3xl font-semibold
                           text-black dark:text-white">
              Admin Login
            </h1>

            <p className="text-gray-700 dark:text-gray-400 text-sm mt-2">
              Yummy-Yummy Control Panel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(adminLogin)} className="space-y-5">

            {/* Admin ID */}
            <div>
              <label className="block text-sm font-medium
                                text-black dark:text-gray-300 mb-2">
                Admin ID
              </label>

              <input
                {...register('admin_id', { required: true })}
                placeholder="Enter admin ID"
                autoComplete="off"
                className="w-full px-4 py-3 rounded-xl border
                           border-gray-300 dark:border-slate-600
                           bg-white dark:bg-slate-900
                           text-black dark:text-white
                           placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium
                                text-black dark:text-gray-300 mb-2">
                Password
              </label>

              <input
                {...register('password', { required: true })}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border
                           border-gray-300 dark:border-slate-600
                           bg-white dark:bg-slate-900
                           text-black dark:text-white
                           placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-medium
                         bg-green-600 hover:bg-green-700
                         text-white transition-all duration-200
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login to Admin Panel →'}
            </button>

          </form>
        </div>

      </motion.div>
    </div>
  )
}