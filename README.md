<div align="center">

# 🍕 Yummy-Yummy Food Ordering System

### A Full-Stack Food Delivery Web Application

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![Django](https://img.shields.io/badge/Django-4.2-092E20?style=for-the-badge&logo=django)
![DRF](https://img.shields.io/badge/DRF-3.15-ff1709?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

**A professional food ordering platform built with React.js + Django REST Framework, featuring JazzCash & EasyPaisa payment integration, real-time admin dashboard, and a stunning responsive UI.**

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## ✨ Features

### 🛍️ Customer Side
- **Beautiful Homepage** — Hero section, popular dishes, testimonials, about section
- **Full Menu** — Browse 500+ dishes with category filter, search, and sort
- **Ultra-Fast Menu** — All dishes loaded once and filtered client-side (zero re-fetches)
- **Smart Cart** — Add, update quantity, remove items with live totals
- **Checkout** — 3-step checkout with address and payment selection
- **💳 Dual Payment** — JazzCash & EasyPaisa mobile wallet integration
- **Cash on Delivery** — Traditional COD option
- **Order History** — Track all past and active orders with status
- **User Profile** — Edit personal info, address, phone number
- **Password Management** — Change password + forgot password with OTP via email
- **Reviews & Feedback** — Star ratings and written reviews
- **Contact Form** — Direct message to restaurant
- **Dark Mode** — Full dark/light theme toggle
- **Fully Responsive** — Works perfectly on mobile, tablet, and desktop

### ⚙️ Admin Panel
- **Dashboard** — Live stats: revenue, orders, customers, dishes, messages
- **Earnings Analytics** — Filter revenue by Day / Week / Month with area charts
- **Order Status Pie** — Visual breakdown of pending, preparing, delivered, cancelled
- **Menu Management** — Full CRUD for menu dishes with image upload
- **Popular Dishes** — Manage featured dishes shown on homepage
- **Categories** — Add, edit, delete food categories
- **Orders** — View all orders, update status, permanently delete orders
- **Customers** — View all customers, click to see full order history + spending stats
- **Messages** — Read and delete customer contact messages
- **Feedback** — View and moderate customer reviews
- **Collapsible Sidebar** — Responsive sidebar that collapses on desktop, drawer on mobile

### 🔐 Security & Auth
- **JWT Authentication** — Access + Refresh tokens with auto-refresh
- **Email OTP** — Professional HTML email for password reset via Gmail SMTP
- **Welcome Email** — Branded welcome email on registration
- **Order Confirmation Email** — Auto-send after successful checkout
- **Protected Routes** — Separate guards for customers and admins

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework with hooks |
| **Vite** | Lightning-fast build tool |
| **Tailwind CSS 3** | Utility-first styling |
| **Framer Motion** | Smooth animations |
| **Zustand** | Global state management |
| **TanStack Query** | Server state, caching, prefetching |
| **React Hook Form + Zod** | Form handling & validation |
| **Axios** | HTTP client with JWT interceptors |
| **Recharts** | Revenue & analytics charts |
| **Lucide React** | Icons |
| **React Hot Toast** | Notifications |

### Backend
| Technology | Purpose |
|---|---|
| **Django 4.2** | Web framework |
| **Django REST Framework** | REST API |
| **SimpleJWT** | JWT authentication |
| **PyMySQL** | MySQL connector |
| **django-cors-headers** | CORS handling |
| **django-filter** | Advanced query filtering |
| **Pillow** | Image processing |
| **python-decouple** | Environment variables |

### Database & Payments
| Technology | Purpose |
|---|---|
| **MySQL** | Primary database (via XAMPP) |
| **JazzCash API** | Mobile wallet payments |
| **EasyPaisa API** | Mobile wallet payments |
| **Gmail SMTP** | Transactional emails |

---

## 🗂️ Project Structure

```
yummy-yummy/
├── frontend/                    # React + Vite
│   └── src/
│       ├── api/                 # Axios API layer (auth, menu, cart, orders...)
│       ├── store/               # Zustand stores (auth, cart, menu, theme)
│       ├── hooks/               # Custom React hooks
│       ├── components/          # Reusable UI components
│       │   ├── layout/          # Navbar, Footer, AdminSidebar, AdminLayout
│       │   ├── ui/              # Modal, Spinner, StarRating, ImageUpload...
│       │   ├── dishes/          # DishCard, DishSkeleton, CategoryTabs
│       │   └── cart/            # CartSidebar, CheckoutModal
│       ├── pages/
│       │   ├── customer/        # Home, Menu, Login, Register, Profile, Orders...
│       │   └── admin/           # Dashboard, MenuDishes, Orders, Customers...
│       ├── routes/              # ProtectedRoute, AdminRoute, GuestRoute
│       └── utils/               # formatters, constants
│
└── backend/                     # Django REST Framework
    └── apps/
        ├── authentication/      # Customer model, JWT, OTP email
        ├── menu/                # Categories, MenuDishes, PopularDishes
        ├── cart/                # Cart & CartItem models
        ├── orders/              # Order, OrderItem, status management
        ├── contact/             # Contact messages
        ├── feedback/            # Customer reviews
        ├── payments/            # JazzCash, EasyPaisa, COD
        └── admin_panel/         # Dashboard stats, customer management
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL (XAMPP recommended)
- Gmail account (for email OTP)

### Backend Setup

```bash
# 1. Navigate to backend
cd yummy_backend

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure .env
cp .env.example .env
# Edit .env with your MySQL and Gmail credentials

# 5. Create MySQL database
mysql -u root -p -e "CREATE DATABASE food CHARACTER SET utf8mb4;"

# 6. Run migrations
python manage.py makemigrations authentication menu cart orders contact feedback admin_panel payments
python manage.py migrate

# 7. Seed sample data
python seed_data.py

# 8. Start server
python manage.py runserver
# → http://localhost:8000
```

### Frontend Setup

```bash
# 1. Navigate to frontend
cd yummy_frontend

# 2. Install packages
npm install

# 3. Start dev server
npm run dev
# → http://localhost:5173
```

### Environment Variables

**Backend `.env`**
```env
SECRET_KEY=your-secret-key
DB_NAME=food
DB_USER=root
DB_PASSWORD=
DB_HOST=127.0.0.1
DB_PORT=3306
EMAIL_HOST_USER=your@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
JAZZCASH_MERCHANT_ID=your-merchant-id
JAZZCASH_PASSWORD=your-password
JAZZCASH_INTEGRITY_SALT=your-salt
EASYPAISA_STORE_ID=your-store-id
EASYPAISA_HASH_KEY=your-hash-key
```

**Frontend `.env`**
```env
VITE_API_URL=http://localhost:8000/api
VITE_MEDIA_URL=http://localhost:8000/media
VITE_DELIVERY_FEE=200
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new customer |
| POST | `/api/auth/login/` | Login → JWT tokens |
| GET/PUT | `/api/auth/profile/` | View/update profile |
| POST | `/api/auth/forgot-password/` | Send OTP via email |
| GET | `/api/menu/dishes/` | List all dishes (search, filter, sort) |
| GET | `/api/menu/popular/` | Featured dishes |
| GET | `/api/cart/` | Get user cart |
| POST | `/api/cart/add/` | Add item to cart |
| POST | `/api/orders/place/` | Place order |
| GET | `/api/orders/` | Order history |
| POST | `/api/payments/jazzcash/` | Initiate JazzCash payment |
| POST | `/api/payments/easypaisa/` | Initiate EasyPaisa payment |
| POST | `/api/payments/cod/` | Cash on delivery |
| GET | `/api/admin/dashboard/stats/` | Admin dashboard stats |
| GET | `/api/orders/admin/all/` | All orders (admin) |

---

## 💳 Payment Flow

```
Customer selects JazzCash/EasyPaisa
        ↓
Frontend calls POST /api/payments/initiate/
        ↓
Django generates HMAC-SHA256 signed request
        ↓
Frontend auto-submits form to Payment Gateway
        ↓
Customer completes payment on gateway page
        ↓
Gateway POSTs result to /api/payments/webhook/
        ↓
Django verifies signature → updates order status
        ↓
Customer redirected to success page
```

---

## 👤 Default Admin Login

```
URL:      http://localhost:5173/admin/login
ID:       ali
Password: 420
```

---

## 📧 Email Features

- 🔐 **OTP Email** — 6-digit code for password reset with 10-min expiry
- 🎉 **Welcome Email** — Branded welcome on registration
- ✅ **Order Confirmation** — Itemized receipt after checkout

---

## 📱 Responsive Design

- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)
- ✅ Large screens (1440px+)

---

## 🌙 Dark Mode

Full dark mode support across all pages and admin panel, persisted in localStorage.

---

---
<p align="center"> <img src="./screenshots/1.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/2.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/3.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/4.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/5.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/6.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/7.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/8.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/9.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/10.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/11.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/12.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/13.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/14.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/15.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/16.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/17.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/18.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/19.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/20.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/21.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/22.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/23.png" width="90%"/> </p> <p align="center"> <img src="./screenshots/24.png" width="90%"/> </p>
---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ in Pakistan 🇵🇰**

*Yummy-Yummy — Best Food In The Country* 😋

</div>
