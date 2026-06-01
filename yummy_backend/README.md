# 🍕 Yummy-Yummy — DRF Backend Setup Guide

## Quick Start

```bash
# 1. Clone / unzip the backend folder
cd yummy_backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure .env (already created — update DB password if needed)
# DB_NAME=food  DB_USER=root  DB_PASSWORD=  DB_HOST=localhost

# 5. Create MySQL database
mysql -u root -p -e "CREATE DATABASE food CHARACTER SET utf8mb4;"

# 6. Run migrations
python manage.py makemigrations authentication menu cart orders contact feedback admin_panel
python manage.py migrate

# 7. Create Django superuser (for /django-admin/)
python manage.py createsuperuser

# 8. Start server
python manage.py runserver      # → http://localhost:8000
```

---

## 📡 All API Endpoints

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | /api/auth/register/ | Register customer | Public |
| POST | /api/auth/login/ | Login → JWT tokens | Public |
| POST | /api/auth/logout/ | Blacklist refresh token | Auth |
| GET/PUT | /api/auth/profile/ | Get/Update profile | Auth |
| POST | /api/auth/change-password/ | Change password | Auth |
| POST | /api/auth/forgot-password/ | Generate reset token | Public |
| POST | /api/auth/reset-password/ | Reset with token | Public |
| POST | /api/auth/token/refresh/ | Refresh JWT | Public |
| GET | /api/menu/categories/ | List categories | Public |
| POST | /api/menu/categories/ | Add category | Admin |
| PUT/DELETE | /api/menu/categories/{id}/ | Update/Delete category | Admin |
| GET | /api/menu/dishes/ | List dishes (filter/search) | Public |
| POST | /api/menu/dishes/ | Add dish (multipart) | Admin |
| PUT/DELETE | /api/menu/dishes/{id}/ | Update/Delete dish | Admin |
| GET | /api/menu/popular/ | List popular dishes | Public |
| POST | /api/menu/popular/ | Add popular dish | Admin |
| PUT/DELETE | /api/menu/popular/{id}/ | Update/Delete popular | Admin |
| GET | /api/cart/ | Get user cart | Auth |
| POST | /api/cart/add/ | Add to cart | Auth |
| PUT | /api/cart/update/{id}/ | Update qty | Auth |
| DELETE | /api/cart/remove/{id}/ | Remove item | Auth |
| DELETE | /api/cart/clear/ | Clear cart | Auth |
| GET | /api/orders/ | User order history | Auth |
| POST | /api/orders/place/ | Place order | Auth |
| GET | /api/orders/{id}/ | Order detail | Auth |
| GET | /api/orders/admin/all/ | All orders | Admin |
| PUT | /api/orders/admin/{id}/status/ | Update status | Admin |
| POST | /api/contact/ | Submit message | Public |
| GET | /api/contact/admin/messages/ | All messages | Admin |
| DELETE | /api/contact/admin/messages/{id}/ | Delete message | Admin |
| GET | /api/feedback/ | All feedback | Public |
| POST | /api/feedback/ | Submit feedback | Auth |
| DELETE | /api/feedback/admin/{id}/ | Delete feedback | Admin |
| POST | /api/admin/login/ | Admin login | Public |
| GET | /api/admin/dashboard/stats/ | Dashboard stats | Admin |
| GET | /api/admin/customers/ | All customers | Admin |
| DELETE | /api/admin/customers/{id}/ | Delete customer | Admin |

---

## 🔐 JWT Usage (Frontend Axios)

```js
// Add to every protected request:
Authorization: Bearer <access_token>

// Refresh when expired:
POST /api/auth/token/refresh/
Body: { "refresh": "<refresh_token>" }
```

---

## 🗄️ Menu Query Examples

```
GET /api/menu/dishes/                        → all dishes
GET /api/menu/dishes/?category=1             → Breakfast only
GET /api/menu/dishes/?search=pizza           → search by name
GET /api/menu/dishes/?ordering=price         → sort low→high
GET /api/menu/dishes/?ordering=-price        → sort high→low
GET /api/menu/dishes/?min_price=100&max_price=500 → price range
```
