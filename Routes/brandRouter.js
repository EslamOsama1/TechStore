const express = require('express');
const brandController = require('../controller/brandController');
const authController = require('../controller/authController');

const brandRouter = express.Router();

brandRouter
    .route('/')
    .get(brandController.getAllBrands)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        brandController.createBrand
    );

brandRouter
    .route('/:id')
    .get(brandController.getBrand)
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        brandController.updateBrand
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        brandController.deleteBrand
    );

module.exports = brandRouter;