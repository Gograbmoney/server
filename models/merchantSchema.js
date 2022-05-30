const mongoose = require('mongoose')

const merchantSchema = new mongoose.Schema({
    merchant: {
        type: String,
        required: [true, "please enter merchant name"]
    },
    image: {
        type: String,
        required: [true, "please enter image url"]
    },
    commision: {
        type: Number,
        required: [true, "please enter cashback"],
        default: 0.0
    },
    category: [{
        type: String,
        required: [true, "please enter the category for this merchant"],
        enum: {
            values: [
                "Baby & Kids",
                "Books",
                "Electronics",
                "Fashion",
                "Finance",
                "Flowers & Gifts",
                "Food & Grocery",
                "Gaming",
                "Health & Beauty",
                "Home & Kitchen",
                "Others",
                "Recharge",
                "Services",
                "Travel"
            ],
            message: "please select correct category for merchant"
        }
    }],
    merchantUrl: {
        type: String,
        required: [true, "please enter merchant url"]
    },
    campaignUrl: {
        type: String,
        required: [true, "please enter campaign url"]
    },
    status: {
        type :Number,
        required: [true, "please enter status"],
        default : 1
    },
    country : [{
        type: String,
        default: "All Countries"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("merchant", merchantSchema);