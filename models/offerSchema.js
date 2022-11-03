const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: [true, "please enter title of offer"]
    },
    Merchant: {
        type: String,
        required: [true, "please enter merchant"]
    },
    top_offer:{
        type : Number,
        default: 0
    },
    "Image URL": {
        type: String,
        required: [true, "please enter image url"]
    },
    commision: {
        type: String,
        required: [true, "please enter cashback"],
        default: "0%"
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
    URL: {
        type: String,
        required: [true, "please enter offer url"]
    },
    carousal_image : {
        type: String
    },
    carousal : {
        type : Number ,
        default : 0
    },
    date_start :{
        type: String
    },
    date_end :{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("offer", offerSchema);