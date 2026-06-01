import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, UtensilsCrossed, Star, Tag, ShoppingBag,
  Users, MessageSquare, MessageCircle, LogOut, ChevronRight,
  Menu, X, ChevronLeft,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLogout } from '@/hooks/useAuth'
import useAuthStore from '@/store/useAuthStore'

const NAV = [
  { to: '/admin',            label: 'Dashboard',      Icon: LayoutDashboard, end: true },
  { to: '/admin/popular',    label: 'Popular Dishes', Icon: Star                       },
  { to: '/admin/categories', label: 'Categories',     Icon: Tag                        },
  { to: '/admin/menu',       label: 'Menu Dishes',    Icon: UtensilsCrossed            },
  { to: '/admin/orders',     label: 'Orders',         Icon: ShoppingBag                },
  { to: '/admin/customers',  label: 'Customers',      Icon: Users                      },
  { to: '/admin/messages',   label: 'Messages',       Icon: MessageSquare              },
  { to: '/admin/feedback',   label: 'Feedback',       Icon: MessageCircle              },
]

export default function AdminSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { handleLogout } = useLogout()
  const user             = useAuthStore((s) => s.user)
  const location         = useLocation()

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const SidebarContent = ({ isMobile = false }) => (
    <div className={`flex flex-col h-full bg-slate-900 ${isMobile ? 'w-64' : collapsed ? 'w-[72px]' : 'w-64'}
                     transition-all duration-300`}>

      {/* Logo */}
      <div className="h-[72px] flex items-center justify-between px-4 border-b border-slate-800 flex-shrink-0">
        <AnimatePresence initial={false}>
          {(!collapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-2.5 overflow-hidden"
            >
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center
                              shadow-lg shadow-green-500/30 text-sm flex-shrink-0">🍕</div>
              <span className="font-display text-lg text-white font-bold whitespace-nowrap">
                Yummy<span className="text-green-400">-Yummy</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* {collapsed && !isMobile ? (
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center
                          shadow-lg shadow-green-500/30 text-sm mx-auto">🍕</div>
        ) : null} */}

        {/* Toggle button - desktop only */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center
                       justify-center text-slate-400 hover:text-white transition-all flex-shrink-0"
          >
            <ChevronLeft size={14} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        )}

        {/* Close on mobile */}
        {isMobile && (
          <button onClick={() => setMobileOpen(false)}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center
                       justify-center text-slate-400 hover:text-white transition-all">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Admin info */}
      {(!collapsed || isMobile) && (
        <div className="px-3 py-3 border-b border-slate-800">
          <div className="flex items-center gap-3 bg-slate-800/60 rounded-xl px-3 py-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600
                            flex items-center justify-center text-white text-xs font-bold flex-shrink-0">A</div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">Admin Panel</p>
              <p className="text-slate-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      )}

      {collapsed && !isMobile && (
        <div className="flex justify-center py-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600
                          flex items-center justify-center text-white text-xs font-bold">A</div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-700">
        {NAV.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
               transition-all duration-200 group relative ${
                isActive
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              } ${collapsed && !isMobile ? 'justify-center' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className="flex-shrink-0" />
                {(!collapsed || isMobile) && (
                  <>
                    <span className="flex-1 truncate">{label}</span>
                    {isActive && <ChevronRight size={13} className="opacity-60 flex-shrink-0" />}
                  </>
                )}
                {/* Tooltip when collapsed */}
                {collapsed && !isMobile && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs
                                  rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100
                                  pointer-events-none transition-opacity z-50 shadow-xl">
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-slate-800">
        <button onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
                      text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200
                      ${collapsed && !isMobile ? 'justify-center' : ''} group relative`}>
          <LogOut size={17} className="flex-shrink-0" />
          {(!collapsed || isMobile) && <span>Sign Out</span>}
          {collapsed && !isMobile && (
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs
                            rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100
                            pointer-events-none transition-opacity z-50 shadow-xl">
              Sign Out
            </div>
          )}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className={`fixed top-0 left-0 bottom-0 z-[900] hidden lg:flex flex-col
                         transition-all duration-300 border-r border-slate-800
                         ${collapsed ? 'w-[72px]' : 'w-64'}`}>
        <SidebarContent />
      </aside>

      {/* ── Mobile Overlay + Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[890] lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 bottom-0 w-64 z-[900] lg:hidden shadow-2xl"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}