const User = require('../models/userModel')
const catchAsync = require('../utils/catchasync')
const AppError = require('./../utils/AppError')
const factory = require('./handlerFactory');
const multer = require('multer')
const sharp = require('sharp')

//Upload User Image  ----------------------------------------------------
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! please upload only images', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadUserPhoto = upload.single('photo')

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next()

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
        .resize(500, 500, {
            fit: 'inside'
        })
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`)

    next()
})

//----------------------------------------------------------------------
//Admin
exports.getAllUsers = factory.getAll(User)
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User)



// user 
//-------------------------------------------------------------
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({ //deleted
        status: "success",
        data: null
    })
})

exports.getMe = catchAsync(async (req, res, next) => {
    req.params.id = req.user.id

    next()
})

exports.updateMe = catchAsync(async (req, res, next) => {

    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
    }

    if (req.file) {
        req.body.photo = req.file.filename
    }
    const updateData = {};

    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.phone !== undefined) updateData.phone = req.body.phone;
    if (req.body.photo !== undefined) updateData.photo = req.body.photo;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true, runValidators: true });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
})