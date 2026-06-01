import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useCartQuery } from '@/hooks/useCart'
import useThemeStore from '@/store/useThemeStore'
import useAuthStore from '@/store/useAuthStore'

// Layout
import Navbar from '@/components/layout/Navbar'
import AdminLayout from '@/components/layout/AdminLayout'
import CartSidebar from '@/components/cart/CartSidebar'

// Route guards
import { ProtectedRoute, AdminRoute, GuestRoute } from '@/routes/ProtectedRoute'

// Customer pages
import HomePage          from '@/pages/customer/HomePage'
import MenuPage          from '@/pages/customer/MenuPage'
import LoginPage         from '@/pages/customer/LoginPage'
import RegisterPage      from '@/pages/customer/RegisterPage'
import ForgotPasswordPage from '@/pages/customer/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/customer/ResetPasswordPage'
import ChangePasswordPage from '@/pages/customer/ChangePasswordPage'
import { ProfilePage }   from '@/pages/customer/ProfilePage'
import OrderPage         from '@/pages/customer/OrderPage'
import ContactPage       from '@/pages/customer/ContactPage'
import FeedbackPage      from '@/pages/customer/FeedbackPage'

// Admin pages
import AdminLoginPage    from '@/pages/admin/AdminLoginPage'
import AdminDashboard    from '@/pages/admin/AdminDashboard'
import AdminMenuDishes   from '@/pages/admin/AdminMenuDishes'
import AdminPopularDishes from '@/pages/admin/AdminPopularDishes'
import AdminCategories   from '@/pages/admin/AdminCategories'
import AdminOrders       from '@/pages/admin/AdminOrders'
import {
  AdminCustomers,
  AdminMessages,
  AdminFeedback,
} from '@/pages/admin/AdminOthers'

// Pages that DON'T show the main navbar
const NO_NAVBAR_PATHS = ['/login', '/register', '/forgot-password', '/admin/login']

function CustomerLayout() {
  // Sync cart from API when logged in
  useCartQuery()

  return (
    <>
      <Navbar />
      <CartSidebar />
    </>
  )
}

export default function App() {
  const { init: initTheme } = useThemeStore()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  // Apply saved theme on mount
  useEffect(() => { initTheme() }, [initTheme])

  return (
    <Routes>
      {/* ── AUTH (Guest only) ───────────────────────────────────────── */}
      <Route element={<GuestRoute />}>
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

      </Route>

      {/* ── ADMIN ───────────────────────────────────────────────────── */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index              element={<AdminDashboard />}     />
          <Route path="menu"        element={<AdminMenuDishes />}    />
          <Route path="popular"     element={<AdminPopularDishes />} />
          <Route path="categories"  element={<AdminCategories />}    />
          <Route path="orders"      element={<AdminOrders />}        />
          <Route path="customers"   element={<AdminCustomers />}     />
          <Route path="messages"    element={<AdminMessages />}      />
          <Route path="feedback"    element={<AdminFeedback />}      />
        </Route>
      </Route>

      {/* ── CUSTOMER (with Navbar + Cart) ───────────────────────────── */}
      <Route
        path="/*"
        element={
          <>
            <CustomerLayout />
            <Routes>
              <Route path="/"         element={<HomePage />}     />
              <Route path="/menu"     element={<MenuPage />}     />
              <Route path="/contact"  element={<ContactPage />}  />
              <Route path="/feedback" element={<FeedbackPage />} />

              {/* Protected customer routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile"         element={<ProfilePage />}        />
                <Route path="/orders"          element={<OrderPage />}          />
                <Route path="/change-password" element={<ChangePasswordPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </>
        }
      />
    </Routes>
  )
}
