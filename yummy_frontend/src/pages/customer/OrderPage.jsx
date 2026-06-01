import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import orderAPI from '@/api/orderAPI'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { ORDER_STATUSES } from '@/utils/constants'
import { PageSpinner } from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import { useNavigate } from 'react-router-dom'

export default function OrderPage() {
  const navigate = useNavigate()
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await orderAPI.getOrders()
      return res.data.results || res.data
    },
  })

  if (isLoading) return <div className="page-container"><PageSpinner /></div>

  return (
    <div className="page-container max-w-4xl mx-auto px-[5%] py-10">
      <div className="mb-8">
        <p className="section-tag mb-2">My Account</p>
        <h1 className="section-title">Order History</h1>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No orders yet"
          description="Start ordering your favourite dishes!"
          action={
            <button onClick={() => navigate('/menu')} className="btn-primary">
              Browse Menu
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const st = ORDER_STATUSES[order.status] || { label: order.status, color: 'badge-navy' }
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card p-6 hover:border-green-DEFAULT transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-navy-DEFAULT dark:text-white text-lg">{order.order_id}</p>
                    <p className="text-gray-400 text-sm mt-1">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`${st.color} badge`}>{st.label}</span>
                    <p className="font-bold text-navy-DEFAULT dark:text-white text-xl mt-2">
                      {formatCurrency(order.total_price)}
                    </p>
                  </div>
                </div>

                {order.items?.length > 0 && (
                  <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <span key={item.id}
                          className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300
                                     px-3 py-1 rounded-full text-xs font-medium">
                          {item.dish_name} × {item.qty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <span>📍</span>
                  <span className="truncate">{order.address}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
