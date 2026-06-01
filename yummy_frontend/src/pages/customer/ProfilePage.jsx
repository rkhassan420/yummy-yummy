// ProfilePage.jsx
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import authAPI from '@/api/authAPI'
import useAuthStore from '@/store/useAuthStore'
import { getInitials, formatDate } from '@/utils/formatters'
import { useQuery } from '@tanstack/react-query'
import orderAPI from '@/api/orderAPI'
import { ORDER_STATUSES } from '@/utils/constants'

export function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const { register, handleSubmit } = useForm({ defaultValues: user || {} })

  const { mutate: save, isPending } = useMutation({
    mutationFn: (data) => authAPI.updateProfile(data),
    onSuccess: (res) => { updateUser(res.data.user); toast.success('Profile updated! ✅') },
    onError: () => toast.error('Update failed.'),
  })

  return (
    <div className="page-container max-w-5xl mx-auto px-[5%] py-10">
      
      {/* Header card - Now matching the theme of bottom cards */}
      <div className="mt-14 card p-8 mb-8 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center
                        text-white text-3xl font-bold font-display border-4 border-white/30">
          {getInitials(`${user?.first_name} ${user?.last_name || ''}`)}
        </div>

        <div>
          <h2 className="font-display text-3xl text-slate-900 dark:text-white">
            {user?.first_name} {user?.last_name}
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            📧 {user?.email} &nbsp;|&nbsp; 🟢 Active Member
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile form */}
        <div className="card p-7">
          <h3 className="font-semibold text-navy-DEFAULT dark:text-white text-lg mb-6 flex items-center gap-2">
            👤 Personal Information
          </h3>
          <form onSubmit={handleSubmit(save)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">First Name</label>
                <input {...register('first_name')} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Last Name</label>
                <input {...register('last_name')} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email (read-only)</label>
              <input value={user?.email || ''} readOnly className="input-field opacity-60 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Phone Number</label>
              <input {...register('cnumber')} className="input-field" placeholder="+92 300 0000000" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Address</label>
              <input {...register('address')} className="input-field" placeholder="Your delivery address" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Postal Code</label>
              <input {...register('postal_code')} className="input-field" placeholder="00000" />
            </div>
            <button type="submit" disabled={isPending} className="btn-secondary w-full py-3">
              {isPending ? 'Saving...' : '💾 Save Profile'}
            </button>
          </form>
        </div>

        {/* Order History */}
        <OrderHistoryCard />
      </div>
    </div>
  )
}

function OrderHistoryCard() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => { const r = await orderAPI.getOrders(); return r.data.results || r.data },
  })

  return (
    <div className="card p-7">
      <h3 className="font-semibold text-navy-DEFAULT dark:text-white text-lg mb-6 flex items-center gap-2">
        📦 Order History
      </h3>
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-2">📭</p>
          <p className="text-sm">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => {
            const st = ORDER_STATUSES[order.status] || { label: order.status, color: 'badge-navy' }
            return (
              <div key={order.id} className="flex items-center justify-between p-4
                                              bg-gray-50 dark:bg-slate-700 rounded-xl">
                <div>
                  <p className="font-semibold text-sm text-navy-DEFAULT dark:text-white">{order.order_id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <span className={`${st.color} badge text-xs`}>{st.label}</span>
                  <p className="text-sm font-bold text-navy-DEFAULT dark:text-white mt-1">
                    Rs. {Number(order.total_price).toLocaleString()}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}