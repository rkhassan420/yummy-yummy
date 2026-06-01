// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
// import { NavLink } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { useLogin } from '@/hooks/useAuth'

// const schema = z.object({
//   email:    z.string().email('Enter a valid email'),
//   password: z.string().min(1, 'Password is required'),
// })

// export default function LoginPage() {
//   const { login, loading } = useLogin()
//   const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

//   return (
//     <div className="min-h-screen flex">
//       {/* Left panel */}
//       <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-navy-DEFAULT to-green-dark
//                       flex-col items-center justify-center p-12 text-center">
//         <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay:0.2 }}>
//           <div className="text-8xl mb-6">😋</div>
//           <h1 className="font-display text-4xl text-white mb-4">Welcome Back!</h1>
//           <p className="text-white/70 text-lg leading-relaxed max-w-sm">
//             Login to enjoy exclusive deals, track your orders, and get personalised recommendations!
//           </p>
//         </motion.div>
//       </div>

//       {/* Right form */}
//       <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-slate-900">
//         <motion.div
//           initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
//           className="w-full max-w-md"
//         >
//           <div className="card p-10">
//             <h2 className="font-display text-3xl text-navy-DEFAULT dark:text-white mb-2">Login</h2>
//             <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Sign in to your account</p>

//             <form onSubmit={handleSubmit(login)} className="space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
//                 <input {...register('email')} type="email" placeholder="you@example.com" className="input-field" />
//                 {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
//                 <input {...register('password')} type="password" placeholder="••••••••" className="input-field" />
//                 {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
//               </div>

//               <div className="flex justify-end">
//                 <NavLink to="/forgot-password" className="text-sm text-green-DEFAULT hover:underline">
//                   Forgot Password?
//                 </NavLink>
//               </div>

//               <button type="submit" disabled={loading} className="btn-secondary w-full py-4 text-base">
//                 {loading ? 'Logging in...' : 'Login Now →'}
//               </button>
//             </form>

//             <p className="text-center text-sm text-gray-500 mt-6">
//               Don't have an account?{' '}
//               <NavLink to="/register" className="text-green-DEFAULT font-medium hover:underline">Register here</NavLink>
//             </p>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   )
// }


import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLogin } from '@/hooks/useAuth'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export default function LoginPage() {
  const { login, loading } = useLogin()
  const { register, handleSubmit, formState: { errors } } =
    useForm({ resolver: zodResolver(schema) })

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">

      {/* Left panel */}
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
      Welcome Back!
    </h1>

    <p className="text-black dark:text-white/80 text-lg leading-relaxed max-w-sm">
      Login to enjoy exclusive deals, track your orders, and get personalised recommendations!
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
          {/* Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-100 dark:border-slate-700">

            <h2 className="font-display text-3xl font-semibold text-navy-900 dark:text-white mb-2">
              Login
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
              Sign in to your account
            </p>

            <form onSubmit={handleSubmit(login)} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>

                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border
                             border-gray-200 dark:border-slate-600
                             bg-white dark:bg-slate-900
                             text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-500
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>

                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border
                             border-gray-200 dark:border-slate-600
                             bg-white dark:bg-slate-900
                             text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <NavLink
                  to="/forgot-password"
                  className="text-sm text-green-600 dark:text-green-400 hover:underline"
                >
                  Forgot Password?
                </NavLink>
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
                {loading ? 'Logging in...' : 'Login Now →'}
              </button>
            </form>

            {/* Register */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Don't have an account?{' '}
              <NavLink
                to="/register"
                className="text-green-600 dark:text-green-400 font-medium hover:underline"
              >
                Register here
              </NavLink>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}