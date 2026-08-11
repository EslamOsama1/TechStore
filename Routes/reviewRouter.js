const express = require('express')
const reviewController = require('./../controller/reviewController')
const authController = require('../controller/authController')

const reviewRouter = new express.Router({ mergeParams: true })

reviewRouter.route('/')
    .get(reviewController.getAllReviews)
    .post(authController.protect, authController.restrictTo('user'), reviewController.setProductUserIds, reviewController.createReview)

reviewRouter.route('/:id')
    .get(reviewController.getReview)
    .patch(authController.protect, authController.restrictTo('user'), reviewController.checkReviewOwner, reviewController.updateReview)
    .delete(authController.protect, authController.restrictTo('admin', 'user'), reviewController.checkReviewOwnerOrAdmin, reviewController.deleteReview)

module.exports = reviewRouter