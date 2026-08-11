const catchAsync = require('../utils/catchasync')
// const AppError = require('./../utils/AppError')
const User = require('../models/userModel');


exports.addProductToWishlist = catchAsync(async (req, res, next) => {

    const product = await Product.findById(req.body.productId);

    if (!product) {
        return next(new AppError('No product found with this ID', 404));
    }


    const user = await User.findByIdAndUpdate(req.user.id, {
        $addToSet: {
            wishlist: req.body.productId
        }
    }, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: 'success',
        results: user.wishlist.length,
        data: {
            wishlist: user.wishlist
        }
    });
})

exports.getWishList = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate({
        path: 'wishlist',
        select: 'name price priceAfterDiscount imageCover ratingsAverage'
    })

    res.status(200).json({
        status: 'success',
        results: user.wishlist.length,
        data: {
            wishlist: user.wishlist
        }
    });
})



exports.removeProductFromWishlist = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, {
        $pull: {
            wishlist: req.params.productId
        }
    },
        {
            new: true,
            runValidators: true
        }
    )

    res.status(200).json({
        status: 'success',
        results: user.wishlist.length,
        data: {
            wishlist: user.wishlist
        }
    });
})
