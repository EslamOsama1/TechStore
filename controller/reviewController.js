const catchAsync = require('./../utils/catchasync')
const AppError = require('../utils/AppError')
const factory = require('./handlerFactory');
const Review = require('../models/reviewModel');
const catchasync = require('../utils/catchasync');

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.createReview = factory.createOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);


exports.setProductUserIds = (req, res, next) => {
    // Nested Route
    req.body.product = req.params.productId
    // Set the current logged-in user
    req.body.user = req.user.id
    next()
}

exports.checkReviewOwner = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new AppError('No review found with this ID', 404));
    }

    // console.log('Review user:', review.user.toString());
    // console.log('Logged user:', req.user.id.toString());
    // console.log('Role:', req.user.role);

    if (review.user._id.toString() !== req.user.id.toString()) {
        return next(new AppError('this review does not belong to you', 403));
    }
    next()

})

exports.checkReviewOwnerOrAdmin = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new AppError('No review found with this ID', 404));
    }

    if (!review.user.equals(req.user.id) && req.user.role !== 'admin') {
        return next(new AppError('You do not have permission to delete this review', 403));
    }

    next();
});