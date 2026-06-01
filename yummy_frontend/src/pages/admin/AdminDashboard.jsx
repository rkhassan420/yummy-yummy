import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  TrendingUp, ShoppingBag, Users, MessageSquare,
  Star, UtensilsCrossed, Tag, AlertCircle,
  DollarSign, Package, Clock, CheckCircle,
} from 'lucide-react'
import { adminAPI } from '@/api/index'
import orderAPI from '@/api/orderAPI'
import { PageSpinner } from '@/components/ui/Spinner'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { ORDER_STATUSES } from '@/utils/constants'

// ─── helpers ─────────────────────────────────────────────────────────────────
function groupByPeriod(orders, period) {
  const now   = new Date()
  const map   = {}

  const key = (d) => {
    const dt = new Date(d)
    if (period === 'day') {
      // last 7 days — group by date
      return dt.toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric' })
    }
    if (period === 'week') {
      // last 8 weeks — group by week number
      const wk = Math.floor((now - dt) / (7 * 86400000))
      return wk === 0 ? 'This week' : `${wk}w ago`
    }
    // month — last 6 months
    return dt.toLocaleDateString('en-PK', { month: 'short', year: '2-digit' })
  }

  orders.forEach((o) => {
    const k = key(o.created_at)
    if (!map[k]) map[k] = { label: k, orders: 0, revenue: 0 }
    map[k].orders  += 1
    map[k].revenue += Number(o.total_price)
  })

  return Object.values(map).reverse()
}

const PERIOD_OPTIONS = [
  { value: 'day',   label: 'Last 7 Days'  },
  { value: 'week',  label: 'Last 8 Weeks' },
  { value: 'month', label: 'Last 6 Months'},
]

const STATUS_COLORS = {
  pending:    '#f59e0b',
  preparing:  '#3b82f6',
  on_the_way: '#8b5cf6',
  delivered:  '#22c55e',
  cancelled:  '#ef4444',
}

const STAT_CARDS = [
  { key: 'menu_dishes',           label: 'Menu Dishes',    Icon: UtensilsCrossed, bg: 'bg-blue-50 dark:bg-blue-500/10',    ic: 'text-blue-600 dark:text-blue-400'    },
  { key: 'popular_dishes',        label: 'Popular Dishes', Icon: Star,            bg: 'bg-yellow-50 dark:bg-yellow-500/10', ic: 'text-yellow-600 dark:text-yellow-400'},
  { key: 'total_orders',          label: 'Total Orders',   Icon: ShoppingBag,     bg: 'bg-green-50 dark:bg-green-500/10',  ic: 'text-green-600 dark:text-green-400'  },
  { key: 'pending_orders',        label: 'Pending',        Icon: AlertCircle,     bg: 'bg-orange-50 dark:bg-orange-500/10', ic: 'text-orange-600 dark:text-orange-400'},
  { key: 'registered_customers',  label: 'Customers',      Icon: Users,           bg: 'bg-teal-50 dark:bg-teal-500/10',    ic: 'text-teal-600 dark:text-teal-400'    },
  { key: 'customer_messages',     label: 'Messages',       Icon: MessageSquare,   bg: 'bg-pink-50 dark:bg-pink-500/10',    ic: 'text-pink-600 dark:text-pink-400'    },
  { key: 'customer_feedback',     label: 'Reviews',        Icon: Star,            bg: 'bg-indigo-50 dark:bg-indigo-500/10', ic: 'text-indigo-600 dark:text-indigo-400'},
  { key: 'categories',            label: 'Categories',     Icon: Tag,             bg: 'bg-purple-50 dark:bg-purple-500/10', ic: 'text-purple-600 dark:text-purple-400'},
]

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700
                    rounded-xl p-3 shadow-xl text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name === 'revenue'
            ? `Revenue: Rs. ${Number(p.value).toLocaleString()}`
            : `Orders: ${p.value}`}
        </p>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState('day')

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => { const r = await adminAPI.getStats(); return r.data },
  })

  const { data: allOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      try {
        const r = await orderAPI.getAllOrders()
        return r.data.results || r.data
      } catch { return [] }
    },
  })

  const chartData = useMemo(() => groupByPeriod(allOrders, period), [allOrders, period])

  const totalRevenue   = allOrders.reduce((s, o) => s + Number(o.total_price), 0)
  const deliveredRevenue = allOrders
    .filter((o) => o.status === 'delivered')
    .reduce((s, o) => s + Number(o.total_price), 0)
  const avgOrder = allOrders.length ? totalRevenue / allOrders.length : 0

  // Status breakdown for pie chart
  const statusData = Object.entries(
    allOrders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1
      return acc
    }, {})
  ).map(([status, count]) => ({
    name:  ORDER_STATUSES[status]?.label || status,
    value: count,
    color: STATUS_COLORS[status] || '#94a3b8',
  }))

  if (statsLoading || ordersLoading) return <PageSpinner />

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            📅 {stats?.today_date} · Welcome back, Admin!
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-500/10
                        border border-green-200 dark:border-green-500/20
                        text-green-700 dark:text-green-400 px-4 py-2 rounded-xl text-sm font-medium w-fit">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          System Online
        </div>
      </div>

      {/* ── Revenue Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue',     value: `Rs. ${totalRevenue.toLocaleString()}`,    Icon: DollarSign, color: 'text-green-600',  bg: 'bg-green-50 dark:bg-green-500/10',   sub: 'All time earnings'          },
          { label: 'Delivered Revenue', value: `Rs. ${deliveredRevenue.toLocaleString()}`, Icon: CheckCircle,color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-500/10',     sub: 'From completed orders'      },
          { label: 'Total Orders',      value: allOrders.length,                           Icon: Package,    color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-500/10', sub: `${stats?.pending_orders||0} pending` },
          { label: 'Avg Order Value',   value: `Rs. ${Math.round(avgOrder).toLocaleString()}`, Icon: TrendingUp,color:'text-orange-600', bg:'bg-orange-50 dark:bg-orange-500/10',  sub: 'Per order average'           },
        ].map(({ label, value, Icon, color, bg, sub }, i) => (
          <motion.div key={label}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ delay: i * 0.08 }}
            className="card p-4 sm:p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              {value}
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-sm font-medium mt-0.5">{label}</p>
            <p className="text-slate-400 text-xs mt-0.5">{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Earnings Chart with period selector ── */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white text-lg">
              Earnings Overview
            </h2>
            <p className="text-slate-400 text-sm mt-0.5">Revenue and order trends</p>
          </div>
          {/* Period selector */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
            {PERIOD_OPTIONS.map(({ value, label }) => (
              <button key={value} onClick={() => setPeriod(value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  period === value
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No order data yet</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top:5, right:10, left:0, bottom:5 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="ord" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="rev" orientation="right" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <YAxis yAxisId="ord" orientation="left"  tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area yAxisId="ord" type="monotone" dataKey="orders"  stroke="#3b82f6" strokeWidth={2}
                fill="url(#ord)" dot={false} name="orders" />
              <Area yAxisId="rev" type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2.5}
                fill="url(#rev)" dot={false} name="revenue" />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {/* Summary pills */}
        {chartData.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-1.5 bg-green-500 rounded-full" />
              <span className="text-slate-500">Revenue: <strong className="text-slate-700 dark:text-slate-300">
                Rs. {chartData.reduce((s, d) => s + d.revenue, 0).toLocaleString()}
              </strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-1.5 bg-blue-500 rounded-full" />
              <span className="text-slate-500">Orders: <strong className="text-slate-700 dark:text-slate-300">
                {chartData.reduce((s, d) => s + d.orders, 0)}
              </strong></span>
            </div>
          </div>
        )}
      </div>

      {/* ── Stat cards + Status pie ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Stat cards grid */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ key, label, Icon, bg, ic }, i) => (
            <motion.div key={key}
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="card p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={16} className={ic} />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.[key] ?? 0}</p>
              <p className="text-slate-500 text-xs mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Order status pie */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Order Status</h3>
          {statusData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              No orders yet
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                    paddingAngle={3} dataKey="value">
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ fontSize:12, borderRadius:10, border:'none', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {statusData.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{name}</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-auto">{value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { emoji:'🍕', label:'Add Dish',      to:'/admin/menu'       },
            { emoji:'⭐', label:'Add Popular',   to:'/admin/popular'    },
            { emoji:'🏷️', label:'Add Category',  to:'/admin/categories' },
            { emoji:'📦', label:'View Orders',   to:'/admin/orders'     },
          ].map(({ emoji, label, to }) => (
            <a key={to} href={to}
              className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/60
                         rounded-xl hover:bg-green-50 dark:hover:bg-green-500/10
                         border border-transparent hover:border-green-200 dark:hover:border-green-500/20
                         transition-all duration-200 group">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                {emoji}
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300
                               group-hover:text-green-700 dark:group-hover:text-green-400 truncate">
                {label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}