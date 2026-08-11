const Brand = require('../models/brandModel');
const factory = require('./handlerFactory');
const catchasync = require('../utils/catchasync');



exports.getAllBrands = factory.getAll(Brand);
exports.getBrand = factory.getOne(Brand);
exports.createBrand = factory.createOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);

exports.updateBrand = catchasync(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id)

    if (!brand) {
        return next(new AppError('There is no brand with this ID', 404));
    }

    brand.name = req.body.name;
    await brand.save()

    res.status(200).json({
        status: 'success',
        data: {
            brand
        }
    });
})
