const catchAsync = require('../utils/catchasync')
const AppError = require('../utils/AppError')
const apiFeature = require('../utils/apiFeature')

exports.getAll = Model => catchAsync(async (req, res, next) => {
    let filter = {}

    if (req.params.productId) {
        filter = { product: req.params.productId }
    }

    const features = new apiFeature(Model.find(filter), req.query).filter().sort().limitFields().pagination()
    const doc = await features.query


    res.status(200).json({
        status: "success",
        result: doc.length,
        data: doc
    })
})

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if (popOptions) query.populate(popOptions)
    const doc = await query;

    if (!doc) { return next(new AppError("there is no document with this ID", 404)) }

    res.status(200).json({
        status: "success",
        data: doc
    })
})


exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body)

    res.status(201).json({
        status: "success",
        data: doc
    })
})




exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!doc) { return next(new AppError("there is no document with this ID", 404)) }

    res.status(200).json({
        status: "success",
        data: doc
    })
})

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) { return next(new AppError("there is no document with this ID", 404)) }

    res.status(204).json({
        status: "success",
        data: null
    })
})
