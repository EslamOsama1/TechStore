const express = require('express');
const authController = require('../controller/authController')
const cartController = require('../controller/cartController')

const cartRouter = express.Router();
exports.cartRouter = cartRouter;

cartRouter.use(authController.protect);

cartRouter.patch('/applyCoupon', cartController.applyCoupon);

cartRouter.route('/')
    .get(cartController.getUserCart)


cartRouter.route('/:productId')
    .post(cartController.addProductToCart)
    .delete(cartController.removeProductFromCart)
    .patch(cartController.updateCartItemQuantity)

module.exports = cartRouter;