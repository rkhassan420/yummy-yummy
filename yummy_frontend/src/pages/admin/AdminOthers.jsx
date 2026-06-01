// import { useState } from 'react'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { motion, AnimatePresence } from 'framer-motion'
// import {
//   Trash2, Search, ChevronRight, X,
//   Mail, Phone, MapPin, Calendar, ShoppingBag,
// } from 'lucide-react'
// import toast from 'react-hot-toast'

// import { adminAPI, contactAPI, feedbackAPI } from '@/api/index'
// import api from '@/api/axiosInstance'
// import { PageSpinner } from '@/components/ui/Spinner'
// import ConfirmDialog from '@/components/ui/ConfirmDialog'
// import { StarDisplay } from '@/components/ui/StarRating'
// import { formatDate, formatCurrency, getInitials } from '@/utils/formatters'
// import { ORDER_STATUSES } from '@/utils/constants'

// // ─────────────────────────────────────────────────────────────────────────────
// // ── CUSTOMERS ─────────────────────────────────────────────────────────────────
// // ─────────────────────────────────────────────────────────────────────────────
// export function AdminCustomers() {
//   const [selectedCustomer, setSelectedCustomer] = useState(null)
//   const [searchQuery,      setSearchQuery]       = useState('')

//   const { data: customers = [], isLoading } = useQuery({
//     queryKey: ['admin-customers'],
//     queryFn:  async () => {
//       const r = await adminAPI.getCustomers()
//       return r.data.results || r.data
//     },
//   })

//   // All orders — filter by customer client-side
//   const { data: allOrders = [] } = useQuery({
//     queryKey: ['admin-orders'],
//     queryFn:  async () => {
//       try {
//         const r = await api.get('/orders/admin/all/')
//         return r.data.results || r.data
//       } catch { return [] }
//     },
//   })

//   const filtered = customers.filter((c) => {
//     if (!searchQuery) return true
//     const fullName = `${c.first_name} ${c.last_name}`.toLowerCase()
//     return (
//       fullName.includes(searchQuery.toLowerCase()) ||
//       c.email.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   })

//   // Filter orders that belong to the selected customer
//   const customerOrders = selectedCustomer
//     ? allOrders.filter((o) => {
//         const orderName = (o.customer_name || '').trim().toLowerCase()
//         const custName  = `${selectedCustomer.first_name} ${selectedCustomer.last_name || ''}`.trim().toLowerCase()
//         return orderName === custName || o.user === selectedCustomer.id
//       })
//     : []

//   const customerRevenue = customerOrders.reduce(
//     (s, o) => s + Number(o.total_price), 0
//   )

//   if (isLoading) return <PageSpinner />

//   return (
//     <div className="space-y-6">

//       {/* Header */}
//       <div>
//         <h1 className="font-display text-2xl sm:text-3xl text-slate-900 dark:text-white">
//           Customers
//         </h1>
//         <p className="text-slate-500 text-sm mt-1">
//           {customers.length} registered customers
//         </p>
//       </div>

//       {/* Search */}
//       <div className="relative max-w-sm">
//         <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//         <input
//           className="input-field pl-10 py-2.5 text-sm"
//           placeholder="Search by name or email..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       {/* Table */}
//       <div className="card overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
//               <tr>
//                 {['Customer', 'Email', 'Phone', 'Address', 'Joined', 'Action'].map((h) => (
//                   <th key={h}
//                     className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500
//                                dark:text-slate-400 uppercase tracking-wider">
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
//               {filtered.map((c, i) => (
//                 <motion.tr key={c.id}
//                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//                   transition={{ delay: Math.min(i * 0.04, 0.3) }}
//                   className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">

//                   {/* Customer */}
//                   <td className="px-5 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600
//                                       text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
//                         {getInitials(`${c.first_name} ${c.last_name || ''}`)}
//                       </div>
//                       <div>
//                         <p className="font-semibold text-sm text-slate-900 dark:text-white">
//                           {c.first_name} {c.last_name}
//                         </p>
//                         <p className="text-xs text-slate-400">ID: {c.id}</p>
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{c.email}</td>
//                   <td className="px-5 py-4 text-sm text-slate-500">{c.cnumber || '—'}</td>
//                   <td className="px-5 py-4 text-sm text-slate-500 max-w-[180px] truncate">
//                     {c.address || '—'}
//                   </td>
//                   <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">
//                     {formatDate(c.date_joined)}
//                   </td>

//                   {/* Action */}
//                   <td className="px-5 py-4">
//                     <button
//                       onClick={() => setSelectedCustomer(c)}
//                       className="flex items-center gap-1.5 text-xs font-semibold text-green-600
//                                  dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-3 py-1.5
//                                  rounded-lg hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors">
//                       View Orders <ChevronRight size={12} />
//                     </button>
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>

//           {filtered.length === 0 && (
//             <div className="text-center py-16 text-slate-400">
//               <p className="text-4xl mb-2">👥</p>
//               <p>No customers found</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Customer Order History Drawer ── */}
//       <AnimatePresence>
//         {selectedCustomer && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1200]"
//               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//               onClick={() => setSelectedCustomer(null)}
//             />

//             {/* Drawer */}
//             <motion.div
//               className="fixed top-0 right-0 bottom-0 w-full max-w-xl
//                          bg-white dark:bg-slate-900 z-[1201] flex flex-col shadow-2xl"
//               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
//               transition={{ type: 'spring', damping: 32, stiffness: 320 }}
//             >
//               {/* Drawer Header */}
//               <div className="flex items-center justify-between px-6 py-5
//                               border-b border-slate-100 dark:border-slate-800">
//                 <div className="flex items-center gap-3">
//                   <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600
//                                   text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
//                     {getInitials(`${selectedCustomer.first_name} ${selectedCustomer.last_name || ''}`)}
//                   </div>
//                   <div>
//                     <h2 className="font-display text-lg text-slate-900 dark:text-white">
//                       {selectedCustomer.first_name} {selectedCustomer.last_name}
//                     </h2>
//                     <p className="text-xs text-slate-400">{customerOrders.length} orders</p>
//                   </div>
//                 </div>
//                 <button onClick={() => setSelectedCustomer(null)}
//                   className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800
//                              flex items-center justify-center text-slate-500
//                              hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
//                   <X size={16} />
//                 </button>
//               </div>

//               {/* Customer Info */}
//               <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800
//                               bg-slate-50 dark:bg-slate-800/50">
//                 <div className="grid grid-cols-2 gap-3">
//                   {[
//                     { Icon: Mail,     text: selectedCustomer.email                          },
//                     { Icon: Phone,    text: selectedCustomer.cnumber  || '—'                },
//                     { Icon: MapPin,   text: selectedCustomer.address  || '—'                },
//                     { Icon: Calendar, text: `Joined ${formatDate(selectedCustomer.date_joined)}` },
//                   ].map(({ Icon, text }) => (
//                     <div key={text} className="flex items-start gap-2">
//                       <Icon size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
//                       <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{text}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Revenue Summary */}
//               <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
//                 <div className="grid grid-cols-3 gap-3">
//                   {[
//                     { label: 'Total Orders', value: customerOrders.length },
//                     { label: 'Total Spent',  value: `Rs. ${customerRevenue.toLocaleString()}` },
//                     {
//                       label: 'Avg Order',
//                       value: customerOrders.length
//                         ? `Rs. ${Math.round(customerRevenue / customerOrders.length).toLocaleString()}`
//                         : 'Rs. 0',
//                     },
//                   ].map(({ label, value }) => (
//                     <div key={label}
//                       className="text-center p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
//                       <p className="text-base font-bold text-slate-900 dark:text-white">{value}</p>
//                       <p className="text-xs text-slate-500 mt-0.5">{label}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Orders List */}
//               <div className="flex-1 overflow-y-auto">
//                 {customerOrders.length === 0 ? (
//                   <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-400 p-8">
//                     <ShoppingBag size={48} strokeWidth={1} />
//                     <div className="text-center">
//                       <p className="font-semibold text-slate-600 dark:text-slate-300">No orders found</p>
//                       <p className="text-sm mt-1">This customer hasn't placed any orders yet</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="p-5 space-y-3">
//                     {customerOrders.map((order) => {
//                       const st = ORDER_STATUSES[order.status] || { label: order.status, color: 'badge-navy' }
//                       return (
//                         <div key={order.id}
//                           className="border border-slate-100 dark:border-slate-700 rounded-xl p-4
//                                      hover:border-green-200 dark:hover:border-green-500/20 transition-colors">

//                           <div className="flex items-start justify-between mb-3">
//                             <div>
//                               <p className="font-bold text-sm text-slate-900 dark:text-white">
//                                 {order.order_id}
//                               </p>
//                               <p className="text-xs text-slate-400 mt-0.5">
//                                 {formatDate(order.created_at)}
//                               </p>
//                             </div>
//                             <div className="text-right">
//                               <span className={`${st.color} badge`}>{st.label}</span>
//                               <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">
//                                 {formatCurrency(order.total_price)}
//                               </p>
//                             </div>
//                           </div>

//                           {order.items?.length > 0 && (
//                             <div className="flex flex-wrap gap-1.5 mb-2">
//                               {order.items.map((item) => (
//                                 <span key={item.id}
//                                   className="bg-slate-100 dark:bg-slate-800 text-slate-600
//                                              dark:text-slate-400 text-xs px-2.5 py-1 rounded-lg font-medium">
//                                   {item.dish_name} ×{item.qty}
//                                 </span>
//                               ))}
//                             </div>
//                           )}

//                           <p className="text-xs text-slate-400 flex items-center gap-1.5">
//                             <MapPin size={11} className="flex-shrink-0" />
//                             <span className="truncate">{order.address}</span>
//                           </p>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // ── MESSAGES ──────────────────────────────────────────────────────────────────
// // ─────────────────────────────────────────────────────────────────────────────
// export function AdminMessages() {
//   const [deleteId, setDeleteId] = useState(null)
//   const qc = useQueryClient()

//   const { data: messages = [], isLoading } = useQuery({
//     queryKey: ['admin-messages'],
//     queryFn:  async () => {
//       const r = await contactAPI.getMessages()
//       return r.data.results || r.data
//     },
//   })

//   const { mutate: deleteMsg, isPending: deleting } = useMutation({
//     mutationFn: (id) => contactAPI.deleteMessage(id),
//     onSuccess:  () => {
//       qc.invalidateQueries({ queryKey: ['admin-messages'] })
//       toast.success('Message deleted.')
//       setDeleteId(null)
//     },
//     onError: () => toast.error('Delete failed.'),
//   })

//   if (isLoading) return <PageSpinner />

//   return (
//     <div className="space-y-6">

//       <div>
//         <h1 className="font-display text-2xl sm:text-3xl text-slate-900 dark:text-white">
//           Customer Messages
//         </h1>
//         <p className="text-slate-500 text-sm mt-1">{messages.length} messages</p>
//       </div>

//       <div className="card overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
//               <tr>
//                 {['#', 'Name', 'Email', 'Phone', 'Message', 'Date', 'Action'].map((h) => (
//                   <th key={h}
//                     className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500
//                                dark:text-slate-400 uppercase tracking-wider">
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
//               {messages.map((m, i) => (
//                 <motion.tr key={m.id}
//                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//                   transition={{ delay: Math.min(i * 0.04, 0.3) }}
//                   className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
//                   <td className="px-5 py-4 text-slate-400 text-sm">{i + 1}</td>
//                   <td className="px-5 py-4 font-semibold text-sm text-slate-900 dark:text-white">
//                     {m.name}
//                   </td>
//                   <td className="px-5 py-4 text-sm text-slate-500">{m.email}</td>
//                   <td className="px-5 py-4 text-sm text-slate-500">{m.cell_number || '—'}</td>
//                   <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-xs">
//                     <p className="truncate">{m.msg}</p>
//                   </td>
//                   <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">
//                     {formatDate(m.created_at)}
//                   </td>
//                   <td className="px-5 py-4">
//                     <button onClick={() => setDeleteId(m.id)}
//                       className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50
//                                  dark:hover:bg-red-500/10 rounded-lg transition-colors">
//                       <Trash2 size={15} />
//                     </button>
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>

//           {messages.length === 0 && (
//             <div className="text-center py-16 text-slate-400">
//               <p className="text-4xl mb-2">💬</p>
//               <p>No messages yet</p>
//             </div>
//           )}
//         </div>
//       </div>

//       <ConfirmDialog
//         isOpen={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={() => deleteMsg(deleteId)}
//         loading={deleting}
//         title="Delete Message"
//         message="Permanently delete this message?"
//       />
//     </div>
//   )
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // ── FEEDBACK ──────────────────────────────────────────────────────────────────
// // ─────────────────────────────────────────────────────────────────────────────
// export function AdminFeedback() {
//   const [deleteId, setDeleteId] = useState(null)
//   const qc = useQueryClient()

//   const { data: feedbacks = [], isLoading } = useQuery({
//     queryKey: ['admin-feedback'],
//     queryFn:  async () => {
//       const r = await feedbackAPI.getAll()
//       return r.data.results || r.data
//     },
//   })

//   const { mutate: deleteFb, isPending: deleting } = useMutation({
//     mutationFn: (id) => feedbackAPI.adminDelete(id),
//     onSuccess:  () => {
//       qc.invalidateQueries({ queryKey: ['admin-feedback'] })
//       toast.success('Review deleted.')
//       setDeleteId(null)
//     },
//     onError: () => toast.error('Delete failed.'),
//   })

//   if (isLoading) return <PageSpinner />

//   return (
//     <div className="space-y-6">

//       <div>
//         <h1 className="font-display text-2xl sm:text-3xl text-slate-900 dark:text-white">
//           Feedback & Reviews
//         </h1>
//         <p className="text-slate-500 text-sm mt-1">{feedbacks.length} reviews</p>
//       </div>

//       {feedbacks.length === 0 ? (
//         <div className="card text-center py-16 text-slate-400">
//           <p className="text-4xl mb-2">🌟</p>
//           <p>No reviews yet</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {feedbacks.map((fb, i) => (
//             <motion.div key={fb.id}
//               initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: Math.min(i * 0.05, 0.4) }}
//               className="card p-5 relative group hover:border-green-200
//                          dark:hover:border-green-500/20 transition-all duration-200">

//               {/* Delete button */}
//               <button onClick={() => setDeleteId(fb.id)}
//                 className="absolute top-3 right-3 p-1.5 text-red-400 hover:text-red-600
//                            hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors
//                            opacity-0 group-hover:opacity-100">
//                 <Trash2 size={14} />
//               </button>

//               {/* Reviewer */}
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900
//                                 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
//                   {fb.name?.[0]?.toUpperCase() || '?'}
//                 </div>
//                 <div>
//                   <p className="font-semibold text-sm text-slate-900 dark:text-white">{fb.name}</p>
//                   <p className="text-xs text-slate-400">{formatDate(fb.created_at)}</p>
//                 </div>
//               </div>

//               <StarDisplay rating={fb.rating} size={14} />

//               <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed italic">
//                 "{fb.review}"
//               </p>
//             </motion.div>
//           ))}
//         </div>
//       )}

//       <ConfirmDialog
//         isOpen={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={() => deleteFb(deleteId)}
//         loading={deleting}
//         title="Delete Review"
//         message="Permanently delete this customer review?"
//       />
//     </div>
//   )
// }

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2, Search, ChevronRight, X,
  Mail, Phone, MapPin, Calendar, ShoppingBag,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { adminAPI, contactAPI, feedbackAPI } from '@/api/index'
import api from '@/api/axiosInstance'
import { PageSpinner } from '@/components/ui/Spinner'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { StarDisplay } from '@/components/ui/StarRating'
import { formatDate, formatCurrency, getInitials } from '@/utils/formatters'
import { ORDER_STATUSES } from '@/utils/constants'

// ─────────────────────────────────────────────────────────────────────────────
// ── CUSTOMERS ─────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export function AdminCustomers() {
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const qc = useQueryClient()

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const r = await adminAPI.getCustomers()
      return r.data.results || r.data
    },
  })

  const { data: allOrders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      try {
        const r = await api.get('/orders/admin/all/')
        return r.data.results || r.data
      } catch { return [] }
    },
  })

  // Delete Customer Mutation
  const { mutate: deleteCustomer, isPending: deleting } = useMutation({
    mutationFn: (id) => adminAPI.deleteCustomer(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-customers'] })
      toast.success('Customer deleted successfully')
      setDeleteId(null)
      if (selectedCustomer?.id === deleteId) {
        setSelectedCustomer(null)
      }
    },
    onError: (err) => {
      const msg = err.response?.data?.detail || 
                  err.response?.data?.message || 
                  'Failed to delete customer'
      toast.error(msg)
    },
  })

  const filtered = customers.filter((c) => {
    if (!searchQuery) return true
    const fullName = `${c.first_name} ${c.last_name}`.toLowerCase()
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const customerOrders = selectedCustomer
    ? allOrders.filter((o) => o.user === selectedCustomer.id)
    : []

  const customerRevenue = customerOrders.reduce(
    (s, o) => s + Number(o.total_price || 0), 0
  )

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Customers
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {customers.length} registered customers
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input-field pl-10 py-2.5 text-sm"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
              <tr>
                {['Customer', 'Email', 'Phone', 'Address', 'Joined', 'Actions'].map((h) => (
                  <th key={h}
                    className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500
                               dark:text-slate-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map((c, i) => (
                <motion.tr key={c.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600
                                      text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {getInitials(`${c.first_name} ${c.last_name || ''}`)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">
                          {c.first_name} {c.last_name}
                        </p>
                        <p className="text-xs text-slate-400">ID: {c.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{c.email}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{c.cnumber || '—'}</td>
                  <td className="px-5 py-4 text-sm text-slate-500 max-w-[180px] truncate">
                    {c.address || '—'}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">
                    {formatDate(c.date_joined)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-green-600
                                   dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-3 py-1.5
                                   rounded-lg hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors">
                        View Orders <ChevronRight size={12} />
                      </button>

                      <button
                        onClick={() => setDeleteId(c.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50
                                   dark:hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <p className="text-4xl mb-2">👥</p>
              <p>No customers found</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Order History Drawer */}
      <AnimatePresence>
        {selectedCustomer && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1200]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
            />

            <motion.div
              className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-white dark:bg-slate-900 z-[1201] 
                         flex flex-col shadow-2xl"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600
                                  text-white flex items-center justify-center text-sm font-bold">
                    {getInitials(`${selectedCustomer.first_name} ${selectedCustomer.last_name || ''}`)}
                  </div>
                  <div>
                    <h2 className="font-display text-lg text-slate-900 dark:text-white">
                      {selectedCustomer.first_name} {selectedCustomer.last_name}
                    </h2>
                    <p className="text-xs text-slate-400">{customerOrders.length} orders</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Customer Info */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { Icon: Mail, text: selectedCustomer.email },
                    { Icon: Phone, text: selectedCustomer.cnumber || '—' },
                    { Icon: MapPin, text: selectedCustomer.address || '—' },
                    { Icon: Calendar, text: `Joined ${formatDate(selectedCustomer.date_joined)}` },
                  ].map(({ Icon, text }) => (
                    <div key={text} className="flex items-start gap-2">
                      <Icon size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Summary */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Total Orders', value: customerOrders.length },
                    { label: 'Total Spent', value: `Rs. ${customerRevenue.toLocaleString()}` },
                    {
                      label: 'Avg Order',
                      value: customerOrders.length
                        ? `Rs. ${Math.round(customerRevenue / customerOrders.length).toLocaleString()}`
                        : 'Rs. 0',
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                      <p className="text-base font-bold text-slate-900 dark:text-white">{value}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orders List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {customerOrders.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-400">
                    <ShoppingBag size={48} strokeWidth={1} />
                    <div className="text-center">
                      <p className="font-semibold text-slate-600 dark:text-slate-300">No orders found</p>
                      <p className="text-sm mt-1">This customer hasn't placed any orders yet</p>
                    </div>
                  </div>
                ) : (
                  customerOrders.map((order) => {
                    const st = ORDER_STATUSES[order.status] || { label: order.status, color: 'badge-navy' }
                    return (
                      <div key={order.id} className="border border-slate-100 dark:border-slate-700 rounded-xl p-4 hover:border-green-200 dark:hover:border-green-500/20 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white">{order.order_id}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{formatDate(order.created_at)}</p>
                          </div>
                          <div className="text-right">
                            <span className={`${st.color} badge`}>{st.label}</span>
                            <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">
                              {formatCurrency(order.total_price)}
                            </p>
                          </div>
                        </div>

                        {order.items?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {order.items.map((item) => (
                              <span key={item.id} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2.5 py-1 rounded-lg font-medium">
                                {item.dish_name} ×{item.qty}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                          <MapPin size={11} className="flex-shrink-0" />
                          <span className="truncate">{order.address}</span>
                        </p>
                      </div>
                    )
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteCustomer(deleteId)}
        loading={deleting}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone and may affect associated orders."
        danger
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ── MESSAGES ──────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export function AdminMessages() {
  const [deleteId, setDeleteId] = useState(null)
  const qc = useQueryClient()

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const r = await contactAPI.getMessages()
      return r.data.results || r.data
    },
  })

  const { mutate: deleteMsg, isPending: deleting } = useMutation({
    mutationFn: (id) => contactAPI.deleteMessage(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-messages'] })
      toast.success('Message deleted.')
      setDeleteId(null)
    },
    onError: () => toast.error('Delete failed.'),
  })

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Customer Messages
        </h1>
        <p className="text-slate-500 text-sm mt-1">{messages.length} messages</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
              <tr>
                {['#', 'Name', 'Email', 'Phone', 'Message', 'Date', 'Action'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {messages.map((m, i) => (
                <motion.tr key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="px-5 py-4 text-slate-400 text-sm">{i + 1}</td>
                  <td className="px-5 py-4 font-semibold text-sm text-slate-900 dark:text-white">{m.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{m.email}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{m.cell_number || '—'}</td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-xs">
                    <p className="truncate">{m.msg}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">
                    {formatDate(m.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => setDeleteId(m.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {messages.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <p className="text-4xl mb-2">💬</p>
              <p>No messages yet</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMsg(deleteId)}
        loading={deleting}
        title="Delete Message"
        message="Permanently delete this message?"
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ── FEEDBACK ──────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export function AdminFeedback() {
  const [deleteId, setDeleteId] = useState(null)
  const qc = useQueryClient()

  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ['admin-feedback'],
    queryFn: async () => {
      const r = await feedbackAPI.getAll()
      return r.data.results || r.data
    },
  })

  const { mutate: deleteFb, isPending: deleting } = useMutation({
    mutationFn: (id) => feedbackAPI.adminDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-feedback'] })
      toast.success('Review deleted.')
      setDeleteId(null)
    },
    onError: () => toast.error('Delete failed.'),
  })

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Feedback & Reviews
        </h1>
        <p className="text-slate-500 text-sm mt-1">{feedbacks.length} reviews</p>
      </div>

      {feedbacks.length === 0 ? (
        <div className="card text-center py-16 text-slate-400">
          <p className="text-4xl mb-2">🌟</p>
          <p>No reviews yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {feedbacks.map((fb, i) => (
            <motion.div key={fb.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.4) }}
              className="card p-5 relative group hover:border-green-200 dark:hover:border-green-500/20 transition-all duration-200">

              <button onClick={() => setDeleteId(fb.id)}
                className="absolute top-3 right-3 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 size={14} />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-sm font-bold">
                  {fb.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">{fb.name}</p>
                  <p className="text-xs text-slate-400">{formatDate(fb.created_at)}</p>
                </div>
              </div>

              <StarDisplay rating={fb.rating} size={14} />

              <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed italic">
                "{fb.review}"
              </p>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteFb(deleteId)}
        loading={deleting}
        title="Delete Review"
        message="Permanently delete this customer review?"
      />
    </div>
  )
}