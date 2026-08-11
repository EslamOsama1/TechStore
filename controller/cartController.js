const Product = require('../models/productModel')
const Cart = require('../models/cartModel')
const Coupon = require('../models/couponModel')
const catchAsync = require('../utils/catchasync')
const AppError = require('./../utils/AppError')

const calcTotalCartPrice = (cart) => {
    let totalPrice = 0;

    cart.cartItems.forEach(element => {
        totalPrice += element.quantity * element.price
    });

    cart.totalCartPrice = totalPrice
}


exports.addProductToCart = catchAsync(async (req, res, next) => {
    // 1) Check if product exists
    const product = await Product.findById(req.params.productId)
    if (!product) return next(new AppError('No product found with this ID', 404));

    // 2) Check if user already has a cart
    let cart = await Cart.findOne({ user: req.user.id })
    if (!cart) {//user didn't have Cart , create one
        cart = await Cart.create({
            user: req.user.id,
            cartItems: [{
                product: product._id,
                quantity: 1,
                price: product.price
            }],
            totalCartPrice: product.price
        })
        return res.status(201).json({
            status: 'success',
            data: {
                cart
            }
        });
    }

    //user already have a cart
    const cartItemIndex = cart.cartItems.findIndex(
        item => item.product.toString() === req.params.productId);// -1 => product does not exist in the cart

    //product exist
    if (cartItemIndex > -1) {
        cart.cartItems[cartItemIndex].quantity += 1
    } else {

        // Product doesn't exist in cart, add it 
        cart.cartItems.push({
            product: product._id,
            quantity: 1,
            price: product.price
        })
    }

    // Update total price
    calcTotalCartPrice(cart)

    await cart.save();

    res.status(200).json({
        status: 'success',
        data: {
            cart
        }
    })
})

exports.getUserCart = catchAsync(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user.id }).populate({
        path: 'cartItems.product',
        select: 'name price imageCover ratingsAverage'
    });

    if (!cart) return next(new AppError('No cart found for this user', 404));

    res.status(200).json({
        status: 'success',
        results: cart.cartItems.length,
        data: {
            cart
        }
    })
})

exports.removeProductFromCart = catchAsync(async (req, res, next) => {
    const cart = await Cart.findOneAndUpdate(
        { user: req.user.id },
        {
            $pull: {
                cartItems: { product: req.params.productId }
            }
        },
        { new: true }
    );

    if (!cart) return next(new AppError('No cart found for this user', 404));

    calcTotalCartPrice(cart)
    await cart.save();

    res.status(200).json({
        status: 'success',
        results: cart.cartItems.length,
        data: {
            cart
        }
    })
})


exports.updateCartItemQuantity = catchAsync(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return next(new AppError('No cart found for this user', 404));

    const cartItemIndex = cart.cartItems.findIndex(
        item => item.product.toString() === req.params.productId);
    if (cartItemIndex === -1) return next(new AppError('No product found in this Cart', 404));

    if (req.body.quantity < 1) {
        return next(new AppError('Quantity must be at least 1', 400));
    }
    cart.cartItems[cartItemIndex].quantity = req.body.quantity

    calcTotalCartPrice(cart)
    await cart.save();

    res.status(200).json({
        status: 'success',
        results: cart.cartItems.length,
        data: {
            cart
        }
    })
})

exports.clearCart = catchAsync(async (req, res, next) => {
    await Cart.findOneAndDelete({ user: req.user.id });

    res.status(204).json({
        status: "success",
        data: null
    });
});


exports.applyCoupon = catchAsync(async (req, res, next) => {

    if (!req.body.coupon) {
        return next(new AppError('Please provide coupon code', 400));
    }

    const coupon = await Coupon.findOne({
        name: req.body.coupon.toUpperCase(),
        expire: { $gt: Date.now() }
    })

    if (!coupon) return next(new AppError('Coupon is invalid or expired', 400));

    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return next(new AppError('No cart found for this user', 404));

    cart.couponDiscount = coupon.discount
    cart.totalPriceAfterDiscount = cart.totalCartPrice - (cart.totalCartPrice * coupon.discount) / 100
    await cart.save();

    res.status(200).json({
        status: "success",
        data: { cart }
    });
});