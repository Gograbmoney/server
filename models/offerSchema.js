const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({
    _id: { 
        type: Schema.Types.ObjectId 
    },
    Id: {
        type: String,
        unique: true
    },
    Title: {
        type: String,
        required: [true, "please enter title of offer"]
    },
    Merchant: {
        type: String,
        required: [true, "please enter merchant"]
    },
    "Image URL": {
        type: String,
        required: [true, "please enter image url"]
    },
    commision: {
        type: Number,
        required: [true, "please enter cashback"],
        default: 0.0
    },
    Categories: {
        type: String,
        required: [true, "please enter the category for this offer"],
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
            message: "please select correct category for offer"
        }
    },
    "Start Date": {
        type: String
    },
    "End Date": {
        type: String
    },
    "Offer Added At": {
        type: String
    },
    URL: {
        type: String,
        required: [true, "please enter offer url"]
    },
    Status: {
        type: String,
        required: [true, "please enter status"],
        default: "live"
    },
    merchant_status: {
        type: Number,
        required: [true, "please enter merchant status"],
        default: 1
    },
    "Campaign ID": {
        type: Number
    },
    "Campaign Name": {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("offer", offerSchema);