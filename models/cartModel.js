const mongoose = require('mongoose');
// const Product = require('./productModel');


const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        required: true
    },
    price: {
        type: Number,
        required: true
    },

});

const cartSchema = new mongoose.Schema({
    cartItems: [cartItemSchema],

    totalCartPrice: {
        type: Number,
        default: 0
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    totalPriceAfterDiscount: Number,
    couponDiscount: {
        type: Number,
        default: 0
    }
});

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart;


