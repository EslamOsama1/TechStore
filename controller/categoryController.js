const catchasync = require('../utils/catchasync');
const Category = require('./../models/categoryModel')
const factory = require('./handlerFactory');
const AppError = require('./../utils/AppError')


exports.getAllCategories = factory.getAll(Category)
exports.getCategory = factory.getOne(Category)
exports.createCategory = factory.createOne(Category)
exports.deleteCategory = factory.deleteOne(Category)


exports.updateCategory = catchasync(async (req, res, next) => {
    const category = await Category.findById(req.params.id)

    if (!category) {
        return next(new AppError('There is no category with this ID', 404));
    }
    category.name = req.body.name;
    await category.save()

    res.status(200).json({
        status: 'success',
        data: {
            category
        }
    });
})



