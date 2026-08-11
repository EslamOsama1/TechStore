const path = require('path');
const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const AppErorr = require('./utils/appError')

const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const hpp = require('hpp')
const cors = require('cors')


const userRouter = require('./Routes/userRouter')
const globalErrorHandler = require('./controller/errorController')
const categoryRouter = require('./Routes/categoryRouter')
const brandRouter = require('./Routes/brandRouter');
const productRouter = require('./Routes/productRouter');
const reviewRouter = require('./Routes/reviewRouter');
const wishListRouter = require('./Routes/wishListRouter');
const cartRouter = require('./Routes/cartRouter');
const couponRouter = require('./Routes/couponRouter');
const orderRouter = require('./Routes/orderRouter');
const orderController = require('./controller/orderController')


const app = express()
app.set('query parser', 'extended')
app.use(express.static(path.join(__dirname, 'public')))

//stripe Webhook Route
app.post('/api/v1/orders/webhook-checkout',
    express.raw({ type: 'application/json' }),
    orderController.webhookCheckout
)

// Security
app.use(helmet());

app.use(cors());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate Limiting
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Body Parser
app.use(express.json({ limit: '10kb' }));


app.use(hpp());

app.use('/api/v1/users', userRouter)
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/brands', brandRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/wishlist', wishListRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/coupons', couponRouter)
app.use('/api/v1/orders', orderRouter)


app.use((req, res, next) => {
    next(new AppErorr(`can't find ${req.originalUrl} on this server!`, 404))
})

//Global Error Handling Middleware
app.use(globalErrorHandler)

module.exports = app