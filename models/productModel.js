const mongoose = require('mongoose');
const slugify = require('slugify');
const Brand = require('./brandModel');
const validator = require('validator')


const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            unique: true,
            trim: true,
            minlength: [2, 'Product name must be at least 2 characters'],
            maxlength: [32, 'Product name must be less than 32 characters']
        },
        slug: {
            type: String,
            lowercase: true
        },
        price: {
            type: Number,
            default: 0,
            required: true,
        },
        priceAfterDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    return val < this.price
                }
            },
            message: "Discount price ({val}) should be below the regular price"
        },
        brand: {
            type: mongoose.Schema.ObjectId,
            ref: 'Brand',
            required: [true, 'Product must belong to a brand']
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: [true, 'Product must belong to a category']

        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'rating must be above 1'],
            max: [5, 'rating must be below 5'],
            set: val => Math.round(val * 10) / 10
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        description: {
            type: String,
            trim: true,
            required: true
        },
        color: String,
        quantity: {
            type: Number,
            required: true,
            default: 0
        },
        sold: {
            type: Number,
            default: 0
        },
        imageCover: {
            type: String,
            required: [true, 'Product image cover is required']
        },
        images: [String]
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id',
    options: {
        select: '-product -createdAt -updatedAt -__v'
    }
})

productSchema.pre('save', function () {
    this.slug = slugify(this.name, {
        lower: true
    });

});

productSchema.pre(/^find/, function () {
    this.populate({
        path: 'brand',
        select: 'name'
    }).populate({
        path: 'category',
        select: 'name'
    });

})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;