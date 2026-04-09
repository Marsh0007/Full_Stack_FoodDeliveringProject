# Full Stack Food Delivery Project

M607 Computer Science Application Lab assessment
A full-stack food delivery web application  
This system allows customers to browse products, add items to cart, place orders, manage profiles, and view order history.  
It also has an admin dashboard for product management, category control, and order monitoring.

---

## Deployment

---
Frontend (Vercel): https://full-stack-food-delivering-project.vercel.app

---
Backend (Render): https://full-stack-fooddeliveringproject.onrender.com

---


## Features

### Customer Features
User registration and login
JWT-based authentication
Browse food products with search and category filtering
Add products to cart
Update cart quantity
Remove cart items
Checkout and place orders
View order history
Manage profile and reset password funcionality
View live delivery weather using OpenWeather API
Dynamic stock visibility

### Admin Features
Admin login with role-based access
Add, edit, and delete products
Add categories
View all customer orders
Update order status
Dashboard analytics (total products, total orders, pending orders, delivered orders)

### Security Features
Password hashing using bcryptjs
JWT authentication
Protected routes
Role-based middleware for admin/customer separation
Environment variable protection using .env


## Tech-Stack Used in this Project

### Frontend
HTML
CSS
JavaScript

### Backend
Node.js
Express.js

### Database
MySQL (Aiven cloud database)

### External API
OpenWeather API

### Deployment
Vercel (Frontend)
Render (Backend)


## Project Structure

```text
Full_Stack_FoodDeliveringProject/
│
├── client/
│   ├── assets/
│   │   └── images/
│   │
│   ├── components/
│   │   ├── adminnavbar.html
│   │   ├── footer.html
│   │   └── navbar.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── admin.js
│   │   ├── adminnavbar.js
│   │   ├── adminorders.js
│   │   ├── adminproducts.js
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── checkout.js
│   │   ├── footer.js
│   │   ├── navbar.js
│   │   ├── orderhistory.js
│   │   ├── products.js
│   │   ├── profile.js
│   │   └── weather.js
│   │
│   ├── admin.html
│   ├── adminorders.html
│   ├── adminproducts.html
│   ├── cart.html
│   ├── checkout.html
│   ├── index.html
│   ├── login.html
│   ├── orderhistory.html
│   ├── products.html
│   ├── profile.html
│   └── register.html
│
├── database/
│   ├── 01_Create_Database.sql
│   ├── 02_Create_Tables.sql
│   └── 03_Sample_Values.sql
│
├── screenshots/
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── weatherController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── cartModel.js
│   │   ├── categoryModel.js
│   │   ├── orderModel.js
│   │   ├── productModel.js
│   │   └── userModel.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── weatherRoutes.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
└── README.md
```

## How to setup the Database

1. Open **MySQL Workbench**.
2. Run the SQL files in this order:
   - `01_Create_Database.sql`
   - `02_Create_Tables.sql`
   - `03_Sample_Values.sql`
3. Make sure the database name matches the value used in your server `.env` file.

---

## Setup the Server Environment Variables

Create or update `server/.env` with your own values:

```env
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
DB_PORT=your_port
JWT_SECRET=your_secret
OPENWEATHER_API_KEY=your_key
```

---

## How to Run the Project

### 1. Run the backend
Open terminal inside the **server** folder:

```bash
cd server
npm install
npm run dev
```

If everything is correct, the backend should run on:

```text
https://full-stack-fooddeliveringproject.onrender.com
```

### 2. Run the frontend
Open the **client** folder using **Live Server** in VS Code.

Start from:

```text
client/index.html
```

or open the main pages directly through Live Server.

---

## Demo Admin Access

Email: admin@test.com
Password: admin123


---

## Main API Routes

* /api/auth/register
* /api/auth/login
* /api/products/all
* /api/cart/:user_id
* /api/orders/place
* /api/orders/all
* /api/weather/current

---

##Note

Sensitive environment variables are excluded for security reasons.
The live deployed version can be tested directly using the links above.

