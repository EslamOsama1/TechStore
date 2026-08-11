# 🛒 TechStore API

A RESTful E-commerce API built with **Node.js, Express.js, and MongoDB**.

TechStore provides a complete backend system for an online electronics store, including authentication, products, categories, brands, reviews, cart, coupons, wishlist, orders, and online payments with Stripe.

## 🚀 Features

* 🔐 User Authentication & Authorization

  * Signup & Login
  * JWT Authentication
  * Protected Routes
  * Role-based Authorization
  * Forgot & Reset Password
  * Update Password
  * Update User Profile

* 📦 Products

  * Create, Read, Update & Delete Products
  * Product Images Upload
  * Image Processing with Sharp
  * Product Categories
  * Product Brands
  * Product Ratings & Reviews

* ⭐ Reviews

  * Create Reviews
  * Update Reviews
  * Delete Reviews
  * One Review per User per Product
  * Automatic Rating Calculation

* 🛒 Shopping Cart

  * Add Products to Cart
  * Update Product Quantity
  * Remove Products
  * Clear Cart
  * Calculate Cart Total

* 🎟️ Coupons

  * Apply Discount Coupons
  * Coupon Expiration
  * Percentage-based Discounts

* ❤️ Wishlist

  * Add Products to Wishlist
  * Remove Products from Wishlist
  * Get User Wishlist

* 📋 Orders

  * Create Cash Orders
  * Get User Orders
  * Order Management
  * Automatic Product Stock Updates

* 💳 Stripe Payments

  * Stripe Checkout
  * Stripe Webhook Integration

## 🛠️ Technologies

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Stripe
* Multer
* Sharp
* Nodemailer
* Postman

## 📁 Project Structure

```text
TechStore/
│
├── Routes/
│   ├── brandRouter.js
│   ├── cartRouter.js
│   ├── categoryRouter.js
│   ├── couponRouter.js
│   ├── orderRouter.js
│   ├── productRouter.js
│   ├── reviewRouter.js
│   ├── userRouter.js
│   └── wishListRouter.js
│
├── controller/
│   ├── authController.js
│   ├── brandController.js
│   ├── cartController.js
│   ├── categoryController.js
│   ├── couponController.js
│   ├── errorController.js
│   ├── handlerFactory.js
│   ├── orderController.js
│   ├── productController.js
│   ├── reviewController.js
│   ├── userController.js
│   └── wishlistController.js
│
├── models/
│   ├── brandModel.js
│   ├── cartModel.js
│   ├── categoryModel.js
│   ├── couponModel.js
│   ├── orderModel.js
│   ├── productModel.js
│   ├── reviewModel.js
│   └── userModel.js
│
├── utils/
│   ├── apiFeature.js
│   ├── appError.js
│   ├── catchasync.js
│   └── email.js
│
├── public/
├── app.js
├── server.js
├── package.json
└── README.md
```

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/EslamOsama1/TechStore.git
```

Navigate to the project:

```bash
cd TechStore
```

Install dependencies:

```bash
npm install
```

## 🔐 Environment Variables

Create a `config.env` file in the root directory and add your environment variables:

```env
NODE_ENV=development
PORT=3000

DATABASE=your_mongodb_connection_string
DATABASE_PASSWORD=your_database_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d

EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_email_password
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

> Never upload your real environment variables or secret keys to GitHub.

## ▶️ Run the Project

Development:

```bash
npm start
```

or:

```bash
npm run start:dev
```

The API will run on:

```text
http://localhost:3000
```

## 📌 API Base URL

```text
/api/v1
```

Main resources:

```text
/api/v1/users
/api/v1/products
/api/v1/categories
/api/v1/brands
/api/v1/reviews
/api/v1/cart
/api/v1/coupons
/api/v1/orders
/api/v1/wishlist
```

## 📮 API Documentation

The API was tested and documented using Postman.

[View TechStore API Documentation](https://documenter.getpostman.com/)

## 💳 Payment

TechStore uses **Stripe Checkout** for online payments and Stripe Webhooks for payment event handling.

## 🔒 Security

The API includes:

* JWT-based authentication
* Password hashing
* Protected routes
* Role-based authorization
* Password reset functionality
* Environment variables for sensitive configuration
* Stripe webhook verification

## 👨‍💻 Author

**Eslam Osama**

GitHub: [EslamOsama1](https://github.com/EslamOsama1)

## 📄 License

This project is for educational and portfolio purposes.
