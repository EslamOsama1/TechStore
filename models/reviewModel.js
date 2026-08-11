const mongoose = require('mongoose');
const Product = require('./productModel');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty'],
        trim: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, ' review must belonge to a Product!']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, ' review must belonge to a User!']
    }
}, {
    timestamps: true
})

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function () {
    this.populate({
        path: 'user',
        select: 'name'
    }).populate({
        path: 'product',
        select: 'name'
    })
})

// aggregation pipline syntax
// Model.aggregate([
//     {
//         $stage: {
//             field: value,
//             field2: {
//                 $operator: "$anotherField"
//             }
//         }
//     }
// ])


reviewSchema.statics.calculateAverageRating = async function (productId) {
    // console.log('Product ID:', productId);
    const stats = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: '$product',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ])

    // console.log(stats);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        })
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }
}

reviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.product)
})

reviewSchema.pre(/^findOneAnd/, async function () {
    // this.rev = await this.findOne()
    this.rev = await this.model.findOne(this.getQuery());

})

reviewSchema.post(/^findOneAnd/, async function () {
    await this.rev.constructor.calculateAverageRating(this.rev.product._id)
})

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review