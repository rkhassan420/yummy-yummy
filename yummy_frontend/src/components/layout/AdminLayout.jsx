import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout() {
  const [collapsed,   setCollapsed]   = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">

      <AdminSidebar
        collapsed={collapsed}   setCollapsed={setCollapsed}
        mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
      />

      {/* Main content — shifts right based on sidebar width */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300
                       ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}>

        {/* Top bar (mobile hamburger + page title area) */}
        <div className="lg:hidden sticky top-0 z-50 bg-white dark:bg-slate-900
                        border-b border-slate-100 dark:border-slate-800
                        flex items-center gap-4 px-4 h-14">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center
                       justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200
                       dark:hover:bg-slate-700 transition-colors">
            <Menu size={18} />
          </button>
          <span className="font-display text-lg text-slate-900 dark:text-white">
            Yummy<span className="text-green-500">-Yummy</span> Admin
          </span>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}