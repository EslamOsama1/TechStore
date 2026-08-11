const express = require('express')
const productController = require('./../controller/productController')
const authController = require('../controller/authController')
const reviewRouter = require('./reviewRouter')

const productRouter = new express.Router()

productRouter.use('/:productId/reviews', reviewRouter);

productRouter.route('/')
    .get(productController.getAllProducts)
    .post(authController.protect,
        authController.restrictTo('admin'),
        productController.uploadProductImage,
        productController.resizeProductImages,
        productController.createProduct)

productRouter.route('/:id')
    .get(productController.getProduct)
    .patch(authController.protect, authController.restrictTo('admin'), productController.updateProduct
    )
    .delete(authController.protect, authController.restrictTo('admin'), productController.deleteProduct)

module.exports = productRouter