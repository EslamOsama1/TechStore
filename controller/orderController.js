const dotenv = require('dotenv')
const catchAsync = require('./../utils/catchasync')
const AppError = require('../utils/AppError')
const Order = require('../models/orderModel')
const Cart = require('../models/cartModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')
const factory = require("./handlerFactory");

console.log(
    "STRIPE_SECRET_KEY exists:",
    !!process.env.STRIPE_SECRET_KEY
);
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);



exports.createCashOrder = catchAsync(async (req, res, next) => {

    // Find the user's cart and make sure it belongs to the logged-in user
    let OrderPrice
    const cart = await Cart.findOne({
        _id: req.params.cartId,
        user: req.user.id
    })
    if (!cart) return next(new AppError("No cart found with thise ID", 404))

    // Determine the final order price (after discount if a coupon is applied)
    if (cart.totalPriceAfterDiscount) {
        OrderPrice = cart.totalPriceAfterDiscount
    } else {
        OrderPrice = cart.totalCartPrice
    }

    // Create a new cash order using the cart data
    const order = await Order.create({
        user: cart.user,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice: OrderPrice,
        paymentMethodType: "cash"
    })

    // Update product inventory after placing the order
    for (const ele of cart.cartItems) {
        const product = await Product.findById(ele.product);
        product.quantity -= ele.quantity;
        product.sold += ele.quantity;
        await product.save();
    }

    // Remove the cart after the order has been created successfully
    await cart.deleteOne()

    // Send the created order back to the client
    res.status(201).json({
        status: 'success',
        data: {
            order
        }
    });
})

// exports.getOrder = factory.getOne(Order);

exports.getAllOrders = factory.getAll(Order);

exports.getLoggedUserOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });

    if (!orders) return next(new AppError('there is no orders for this user', 404))

    res.status(200).json({
        status: "success",
        results: orders.length,
        data: {
            orders
        }
    });
});


exports.createCardOrder = catchAsync(async (req, res, next) => {

    // Find the user's cart and make sure it belongs to the logged-in user

    const cart = await Cart.findOne({
        _id: req.params.cartId,
        user: req.user.id
    }).populate("cartItems.product")

    if (!cart) return next(new AppError("No cart found with thise ID", 404))
    if (cart.cartItems.length < 1) return next(new AppError("the cart is Empty", 404))


    // Determine the final order price (after discount if a coupon is applied)
    const orderPrice = cart.totalPriceAfterDiscount || cart.totalCartPrice


    // Create a new cash order using the cart data
    const order = await Order.create({
        user: cart.user,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice: orderPrice,
        paymentMethodType: "card"
    })

    const discount = cart.couponDiscount || 0;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',

        line_items: cart.cartItems.map((item) => {
            const discountedPrice =
                item.price * (1 - discount / 100);

            return {
                price_data: {
                    currency: "egp",
                    product_data: {
                        name: item.product.name
                    },
                    unit_amount: Math.round(discountedPrice * 100)
                },
                quantity: item.quantity
            };
        }),


        success_url: `${req.protocol}://${req.get("host")}/api/v1/orders/payment-success`,

        cancel_url: `${req.protocol}://${req.get("host")}/api/v1/orders/payment-cancel`,

        metadata: {
            orderId: order._id.toString()
        }
    })

    res.status(201).json({
        status: "success",
        data: {
            session
        }
    });
})

exports.webhookCheckout = async (req, res, next) => {

    // Verify that the webhook request really came from Stripe
    const signature = req.headers['stripe-signature']

    let event

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Handle successful Stripe Checkout payment
    if (event.type === 'checkout.session.completed') {

        const session = event.data.object

        // Make sure the payment was actually completed
        if (session.payment_status !== 'paid') {
            return res.status(200).json({ received: true })
        }

        // Get the order ID that we stored in Stripe metadata
        const orderId = session.metadata.orderId

        const order = await Order.findById(orderId)

        if (!order) {
            return res.status(404).json({
                status: 'fail',
                message: 'Order not found'
            })
        }

        // Prevent processing the same webhook twice
        if (order.isPaid) {
            return res.status(200).json({ received: true })
        }

        // Mark the order as paid
        order.isPaid = true

        // Update products stock and sold quantity
        for (const item of order.cartItems) {
            const product = await Product.findById(item.product)

            if (!product) continue

            product.quantity -= item.quantity
            product.sold += item.quantity

            await product.save()
        }

        await order.save()

        // Remove the user's cart after successful payment
        await Cart.deleteOne({
            user: order.user
        })
    }

    // Tell Stripe that we received the webhook successfully
    res.status(200).json({
        received: true
    })
}