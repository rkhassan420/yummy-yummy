// import { useState } from 'react'
// import { NavLink } from 'react-router-dom'
// import { useMutation } from '@tanstack/react-query'
// import { motion } from 'framer-motion'
// import toast from 'react-hot-toast'
// import authAPI from '@/api/authAPI'

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState('')
//   const [sent, setSent] = useState(false)

//   const { mutate, isPending } = useMutation({
//     mutationFn: () => authAPI.forgotPassword({ email }),
   
//     onSuccess: () => {
//   setSent(true)
//   toast.success('Reset link sent! 📧')
//   navigate('/reset-password', { state: { email } })
// },
//     onError: (e) =>
//       toast.error(
//         e.response?.data?.email?.[0] || 'Email not found.'
//       ),
//   })

//   return (
//     <div className="min-h-screen flex bg-white dark:bg-slate-950">

//       {/* Left Panel */}
//       <div
//         className="hidden lg:flex w-[45%]
//         bg-gradient-to-br from-navy-900 to-green-700
//         flex-col items-center justify-center
//         p-12 text-center"
//       >
//         <motion.div
//           initial={{ scale: 0.85, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <img
//             src="/about.png"
//             alt="Forgot Password"
//             className="w-48 h-48 object-contain mx-auto mb-6"
//           />

//           <h1 className="font-display text-4xl font-semibold text-white mb-4">
//             Reset Password
//           </h1>

// <p className="text-black dark:text-white/80 text-lg max-w-sm leading-relaxed">            Enter your email and we'll send you a secure link to reset your password.
//           </p>
//         </motion.div>
//       </div>

//       {/* Right Panel */}
//       <div
//         className="flex-1 flex items-center justify-center
//         p-6 sm:p-10 bg-gray-50 dark:bg-slate-900"
//       >
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="w-full max-w-md"
//         >
//           <div
//             className="bg-white dark:bg-slate-800
//             rounded-2xl shadow-xl
//             border border-gray-200 dark:border-slate-700
//             p-8 sm:p-10"
//           >
//             {sent ? (
//               <div className="text-center py-4">

//                 <div className="text-6xl mb-4">📬</div>

//                 <h2 className="font-display text-2xl font-semibold text-black dark:text-white mb-3">
//                   Check Your Email
//                 </h2>

//                 <p className="text-gray-700 dark:text-gray-400 text-sm mb-6">
//                   We've sent a reset link to
//                   <br />
//                   <span className="font-medium">{email}</span>
//                 </p>

//                 <NavLink
//                   to="/login"
//                   className="inline-block px-8 py-3 rounded-xl font-medium
//                   bg-green-600 hover:bg-green-700
//                   text-white transition-all duration-200"
//                 >
//                   ← Back to Login
//                 </NavLink>

//               </div>
//             ) : (
//               <>
//                 <h2 className="font-display text-3xl font-semibold text-black dark:text-white mb-2">
//                   Forgot Password?
//                 </h2>

//                 <p className="text-gray-700 dark:text-gray-400 mb-8 text-sm">
//                   Enter your registered email address
//                 </p>

//                 <div className="space-y-5">

//                   <div>
//                     <label
//                       className="block text-sm font-medium
//                       text-black dark:text-gray-300 mb-2"
//                     >
//                       Email Address
//                     </label>

//                     <input
//                       type="email"
//                       placeholder="you@example.com"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="
//                         w-full px-4 py-3 rounded-xl border
//                         border-gray-300 dark:border-slate-600
//                         bg-white dark:bg-slate-900
//                         text-black dark:text-white
//                         placeholder-gray-500 dark:placeholder-gray-500
//                         focus:outline-none
//                         focus:ring-2 focus:ring-green-500
//                       "
//                     />
//                   </div>

//                   <button
//                     onClick={() => mutate()}
//                     disabled={isPending || !email}
//                     className="
//                       w-full py-3.5 rounded-xl font-medium
//                       bg-green-600 hover:bg-green-700
//                       text-white transition-all duration-200
//                       disabled:opacity-60
//                       disabled:cursor-not-allowed
//                     "
//                   >
//                     {isPending
//                       ? 'Sending...'
//                       : 'Send Reset Link →'}
//                   </button>

//                   <div className="text-center">
//                     <NavLink
//                       to="/login"
//                       className="
//                         text-sm
//                         text-green-600
//                         dark:text-green-400
//                         hover:underline
//                       "
//                     >
//                       ← Back to Login
//                     </NavLink>
//                   </div>

//                 </div>
//               </>
//             )}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   )
// }


import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import authAPI from '@/api/authAPI'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    mutationFn: () => authAPI.forgotPassword({ email }),
    onSuccess: () => {
      toast.success('OTP sent! Check your email 📧')
      navigate('/reset-password', { state: { email } })
    },
    onError: (e) =>
      toast.error(e.response?.data?.email?.[0] || 'Email not found.'),
  })

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">

      {/* Left Panel */}
      <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-navy-900 to-green-700 flex-col items-center justify-center p-12 text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src="/about.png" alt="Forgot Password" className="w-48 h-48 object-contain mx-auto mb-6" />
          <h1 className="font-display text-4xl font-semibold text-white mb-4">Forgot Password?</h1>
          <p className="text-black dark:text-white/80 text-lg max-w-sm leading-relaxed">
            Enter your email and we'll send you a 6-digit OTP to reset your password.
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
            <h2 className="font-display text-3xl font-semibold text-black dark:text-white mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-700 dark:text-gray-400 mb-8 text-sm">
              Enter your registered email address
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                onClick={() => mutate()}
                disabled={isPending || !email}
                className="w-full py-3.5 rounded-xl font-medium bg-green-600 hover:bg-green-700 text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? 'Sending...' : 'Send OTP →'}
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