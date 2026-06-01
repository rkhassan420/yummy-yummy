import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, Moon, Sun, Menu, X, ChevronDown, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '@/store/useAuthStore'
import useCartStore from '@/store/useCartStore'
import useMenuStore from '@/store/useMenuStore'
import useThemeStore from '@/store/useThemeStore'
import { useLogout } from '@/hooks/useAuth'
import { getInitials } from '@/utils/formatters'

export default function Navbar() {
  const [searchOpen,   setSearchOpen]   = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [scrolled,     setScrolled]     = useState(false)
  const searchRef = useRef()

  const { user, isLoggedIn, isAdmin } = useAuthStore()
  const { items, toggleCart }         = useCartStore()
  const { setSearch }                 = useMenuStore()
  const { isDark, toggle: toggleTheme } = useThemeStore()
  const { handleLogout }              = useLogout()
  const navigate = useNavigate()

  const cartCount = items.reduce((s, i) => s + i.qty, 0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const navLinks = [
    { to: '/',         label: 'Home'    },
    { to: '/menu',     label: 'Menu'    },
    { to: '/orders',   label: 'Orders'  },
    { to: '/contact',  label: 'Contact' },
    { to: '/feedback', label: 'Reviews' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300
      ${scrolled
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/80'
        : 'bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800'
      } h-[72px] flex items-center px-[5%]`}>

      {/* <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-6"> */}
        <div className="w-full flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center
                          shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50
                          group-hover:scale-105 transition-all duration-200">
            <span className="text-lg">🍕</span>
          </div>
          <span className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Yummy<span className="text-green-500">-Yummy</span>
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                 ${isActive
                   ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10'
                   : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                 }`
              }
            >{label}</NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin"
              className="px-4 py-2 rounded-xl text-sm font-medium text-orange-600 dark:text-orange-400
                         hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all">
              ⚙️ Admin
            </NavLink>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">

          {/* Search */}
          <div className="relative hidden md:flex items-center">
            <AnimatePresence>
              {searchOpen && (
                <motion.input ref={searchRef}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="input-field py-2 pl-10 pr-4 text-sm absolute right-9 w-[220px]"
                  placeholder="Search dishes..."
                  onChange={(e) => { setSearch(e.target.value); if (e.target.value) navigate('/menu') }}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                />
              )}
            </AnimatePresence>
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="relative z-10 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800
                         text-slate-500 dark:text-slate-400 transition-colors">
              <Search size={18} />
            </button>
          </div>

          {/* Dark mode */}
          <button onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800
                       text-slate-500 dark:text-slate-400 transition-colors">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Cart */}
          <button onClick={toggleCart}
            className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800
                       text-slate-500 dark:text-slate-400 transition-colors">
            <ShoppingCart size={18} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px]
                             font-bold w-5 h-5 rounded-full flex items-center justify-center
                             border-2 border-white dark:border-slate-900 shadow-sm">
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* User */}
          {isLoggedIn ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl
                           hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600
                                text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {getInitials(`${user?.first_name} ${user?.last_name || ''}`)}
                </div>
                <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {user?.first_name}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity:0, y:-8, scale:0.95 }}
                    animate={{ opacity:1, y:0, scale:1 }}
                    exit={{ opacity:0, y:-8, scale:0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800
                               border border-slate-100 dark:border-slate-700 rounded-2xl
                               shadow-xl shadow-slate-200/60 dark:shadow-slate-900 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{user?.first_name} {user?.last_name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                    {[
                      { to:'/profile',         icon:'👤', label:'My Profile'       },
                      { to:'/orders',          icon:'📦', label:'My Orders'        },
                      { to:'/feedback',        icon:'💬', label:'Feedback'         },
                      { to:'/change-password', icon:'🔐', label:'Change Password'  },
                    ].map(({ to, icon, label }) => (
                      <NavLink key={to} to={to} onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 dark:text-slate-300
                                   hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors">
                        <span>{icon}</span>{label}
                      </NavLink>
                    ))}
                    <div className="border-t border-slate-100 dark:border-slate-700" />
                    <button onClick={() => { handleLogout(); setUserMenuOpen(false) }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500
                                 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                      🚪 Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <NavLink to="/login"
              className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2">
              <User size={15} /> Login
            </NavLink>
          )}

          {/* Mobile menu */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800
                       text-slate-500 dark:text-slate-400 transition-colors">
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900
                       border-b border-slate-100 dark:border-slate-800 lg:hidden overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium transition-all
                     ${isActive ? 'bg-green-50 dark:bg-green-500/10 text-green-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`
                  }
                >{label}</NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}