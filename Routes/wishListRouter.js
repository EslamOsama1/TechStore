const express = require('express')
const wishlistController = require('../controller/wishlistController')
const authController = require('../controller/authController');


let wishListRouter = express.Router()

wishListRouter.use(authController.protect);

wishListRouter.route('/')
    .post(wishlistController.addProductToWishlist)
    .get(wishlistController.getWishList)

wishListRouter.route('/:productId')
    .patch(wishlistController.removeProductFromWishlist)
module.exports = wishListRouter