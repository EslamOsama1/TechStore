const express = require('express')
const Coupon = require('../controller/couponController');
const authController = require('../controller/authController');
const couponController = require('../controller/couponController');


const couponRouter = express.Router()

couponRouter.use(authController.protect);

couponRouter.use(authController.restrictTo('admin'));

couponRouter
    .route('/')
    .get(couponController.getAllCoupons)
    .post(couponController.createCoupon);

couponRouter
    .route('/:id')
    .get(couponController.getCoupon)
    .patch(couponController.updateCoupon)
    .delete(couponController.deleteCoupon);


module.exports = couponRouter