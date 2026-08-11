const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Coupon name is required'],
            unique: true,
            uppercase: true,
            trim: true
        },
        expire: {
            type: Date,
            required: [true, 'Coupon expiration date is required']
        },
        discount: {
            type: Number,
            required: [true, 'Coupon discount is required'],
            min: [1, 'Discount must be at least 1%'],
            max: [100, 'Discount cannot exceed 100%']
        }
    },
    {
        timestamps: true
    }
);



const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;