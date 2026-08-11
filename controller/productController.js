const Product = require('../models/productModel')
const catchAsync = require('./../utils/catchasync')
const AppError = require('./../utils/AppError')
const factory = require('./handlerFactory');
const multer = require('multer')
const sharp = require('sharp')

// Product Images Upload
const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! please upload only images', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadProductImage = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
])

exports.resizeProductImages = catchAsync(async (req, res, next) => {

    if (!req.files?.imageCover) return next();

    const timestamp = Date.now();

    //1) Cover Image
    req.body.imageCover = `product-${timestamp}-cover.jpeg`

    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333, {
            fit: 'inside'
        })
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${req.body.imageCover}`)

    // 2) Images
    if (req.files.images) {
        req.body.images = [];

        await Promise.all(req.files.images.map(async (file, i) => {

            const filename = `product-${timestamp}-${i + 1}.jpeg`

            await sharp(file.buffer)
                .resize(2000, 1333, {
                    fit: 'inside'
                })
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/products/${filename}`)

            req.body.images.push(filename)
        }))
    }
    next()

})


exports.getAllProducts = factory.getAll(Product);

exports.getProduct = factory.getOne(Product, 'reviews');

exports.createProduct = factory.createOne(Product);

exports.deleteProduct = factory.deleteOne(Product);


exports.updateProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new AppError('There is no product with this ID', 404));
    }

    const allowedFields = [
        'name',
        'price',
        'priceAfterDiscount',
        'description',
        'brand',
        'category',
        'imageCover',
        'images'
    ];

    Object.keys(req.body).forEach((key) => {
        if (allowedFields.includes(key)) {
            product[key] = req.body[key];
        }
    });

    await product.save()

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
})