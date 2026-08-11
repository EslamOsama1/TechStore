const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Order must belong to a user"],
        },

        cartItems: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                color: String,
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],

        shippingAddress: {
            details: {
                type: String,
                required: [true, "Shipping address details are required"],
            },
            phone: {
                type: String,
                required: [true, "Phone number is required"],
            },
            city: {
                type: String,
                required: [true, "City is required"],
            },
            postalCode: String,
        },

        paymentMethodType: {
            type: String,
            enum: ["cash", "card"],
            default: "cash",
        },

        totalOrderPrice: {
            type: Number,
            required: [true, "Order must have a total price"],
        },

        isPaid: {
            type: Boolean,
            default: false,
        },

        paidAt: Date,

        isDelivered: {
            type: Boolean,
            default: false,
        },

        deliveredAt: Date,
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;