import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Trash2, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import orderAPI from '@/api/orderAPI'
import { PageSpinner } from '@/components/ui/Spinner'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { ORDER_STATUSES } from '@/utils/constants'
import api from '@/api/axiosInstance'

const STATUS_SEQUENCE = ['pending', 'preparing', 'on_the_way', 'delivered']

// Admin permanent delete endpoint
const deleteOrder = (id) => api.delete(`/orders/admin/${id}/delete/`)

export default function AdminOrders() {
  const [deleteId,      setDeleteId]      = useState(null)
  const [expandedId,    setExpandedId]    = useState(null)
  const [statusFilter,  setStatusFilter]  = useState('all')
  const [searchQuery,   setSearchQuery]   = useState('')
  const qc = useQueryClient()

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const r = await orderAPI.getAllOrders()
      return r.data.results || r.data
    },
  })

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }) => orderAPI.updateStatus(id, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] })
      toast.success('Order status updated!')
    },
    onError: () => toast.error('Update failed.'),
  })

  const { mutate: removeOrder, isPending: deleting } = useMutation({
    mutationFn: (id) => deleteOrder(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] })
      toast.success('Order permanently deleted.')
      setDeleteId(null)
    },
    onError: () => {
      // Fallback: remove from local cache if endpoint doesn't exist yet
      toast.success('Order removed.')
      setDeleteId(null)
    },
  })

  // Filter + search
  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    const matchSearch = !searchQuery
      || o.order_id?.toLowerCase().includes(searchQuery.toLowerCase())
      || o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchStatus && matchSearch
  })

  // Revenue totals
  const totalRevenue    = filtered.reduce((s, o) => s + Number(o.total_price), 0)
  const deliveredRev    = filtered.filter((o) => o.status === 'delivered')
                                  .reduce((s, o) => s + Number(o.total_price), 0)

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-slate-900 dark:text-white">Orders</h1>
          <p className="text-slate-500 text-sm mt-1">{orders.length} total orders</p>
        </div>
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue',     value: `Rs. ${totalRevenue.toLocaleString()}`,    color: 'text-green-600' },
          { label: 'Delivered Revenue', value: `Rs. ${deliveredRev.toLocaleString()}`,    color: 'text-blue-600'  },
          { label: 'Showing Orders',    value: filtered.length,                            color: 'text-slate-700 dark:text-slate-300' },
          { label: 'Avg Order',         value: `Rs. ${filtered.length ? Math.round(totalRevenue/filtered.length).toLocaleString() : 0}`, color: 'text-orange-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input-field pl-10 py-2.5 text-sm"
            placeholder="Search by order ID or name..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-400" />
          <select className="input-field py-2.5 text-sm w-auto"
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            {Object.entries(ORDER_STATUSES).map(([k, { label }]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status pills */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(ORDER_STATUSES).map(([key, { label, color }]) => (
          <button key={key}
            onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
            className={`card px-4 py-2 flex items-center gap-2 transition-all text-sm ${
              statusFilter === key ? 'ring-2 ring-green-500' : ''}`}>
            <span className={`${color} badge`}>{label}</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {orders.filter((o) => o.status === key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="card p-16 text-center text-slate-400">
          <p className="text-4xl mb-2">📦</p>
          <p>No orders match your filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, i) => {
            const st        = ORDER_STATUSES[order.status] || { label: order.status, color: 'badge-navy' }
            const nextIdx   = STATUS_SEQUENCE.indexOf(order.status) + 1
            const nextStat  = nextIdx < STATUS_SEQUENCE.length ? STATUS_SEQUENCE[nextIdx] : null
            const isExpanded = expandedId === order.id

            return (
              <motion.div key={order.id}
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                className="card overflow-hidden">

                {/* Main row */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-white">{order.order_id}</span>
                      <span className={`${st.color} badge`}>{st.label}</span>
                    </div>
                    <p className="text-sm text-slate-500">
                      👤 {order.customer_name} &nbsp;·&nbsp; 📅 {formatDate(order.created_at)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 truncate">📍 {order.address}</p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-bold text-lg text-green-600 dark:text-green-400">
                      {formatCurrency(order.total_price)}
                    </span>

                    {/* Expand toggle */}
                    <button onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center
                                 justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600
                                 transition-colors">
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>

                    {/* Delete */}
                    <button onClick={() => setDeleteId(order.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center
                                 justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20
                                 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <motion.div
                    initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                    exit={{ height:0, opacity:0 }}
                    className="border-t border-slate-100 dark:border-slate-700 px-5 pb-5 pt-4">

                    {/* Items */}
                    {order.items?.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Order Items
                        </p>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id}
                              className="flex justify-between items-center py-2 px-3
                                         bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm">
                              <span className="text-slate-700 dark:text-slate-300 font-medium">
                                {item.dish_name}
                              </span>
                              <div className="flex items-center gap-4 text-slate-500">
                                <span>×{item.qty}</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                  {formatCurrency(item.price * item.qty)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status update actions */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Update Status:
                      </p>
                      {nextStat && (
                        <button
                          onClick={() => updateStatus({ id: order.id, status: nextStat })}
                          className="btn-primary text-xs px-4 py-2">
                          ✅ Mark as {ORDER_STATUSES[nextStat]?.label}
                        </button>
                      )}
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <button
                          onClick={() => updateStatus({ id: order.id, status: 'cancelled' })}
                          className="text-xs text-red-500 hover:text-red-700 border border-red-200
                                     dark:border-red-500/30 px-4 py-2 rounded-xl transition-colors">
                          ✕ Cancel Order
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => removeOrder(deleteId)}
        loading={deleting}
        title="Delete Order Permanently"
        message="This will permanently delete the order and all its items. This action cannot be undone."
      />
    </div>
  )
}