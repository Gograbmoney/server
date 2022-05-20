const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter product name"],
        trim: true,
        maxlength: [100, "product length can not exceed 100 characters"]
    },
    images: {
            type: String,
            required: [true,"please enter image url"]
    },
    store : {
        type : String,
        required :[true,"please enter store"],

    } ,
    brand : {
        type : String,
        required :[true,"please enter brand"],
    },
    price: {
        type: Number,
        required: [true, "please enter price"],
        default: 0.0
    },
    cashback: {
        type: Number,
        required: [true, "please enter cashback"],
        default: 0.0
    },
    category: {
        type: String,
        required: [true, "please enter the category for this product"],
        enum: {
            values: [
                "Air Conditioners",
                "Air Purifers",
                "Baby Products",
                "Baby Grooming",
                "Baby Skin Care",
                "Bath Essentials",
                "Beauty",
                "Beard & Shaving",
                "Backpacks",
                "Computers and Accessories" ,
                "Cameras" ,
                "Creams & Moisturizers" ,
                "Data Storage" ,
                "Diapers" ,
                "Deodorants" ,
                "Electronics" ,
                "Face Wash & Cleansers" ,
                "Face Masks & Peels" ,
                "Fragrances" ,
                "Food Processors" ,
                "Fashion Accessories" ,
                "Grocery" ,
                "Hair Care" ,
                "Hair Conditioners" ,
                "Hair Styling" ,
                'Hair Treatment' ,
                'Hair Dryers' ,
                'Hair Straighteners' ,
                'Home Appliances' ,
                'Hand Blenders' ,
                'Headphones' ,
                'Irons' ,
                'Induction Cooktops' ,
                'Juicer Mixer Grinders' ,
                'Kurtas & Kurtis' ,
                'Kitchen Appliances' ,
                'Lotions & Massage Oils' ,
                'Laptops' ,
                'Lingerie' ,
                'Mobile Phones' ,
                'Monitors' ,
                'Men Clothing' ,
                'Men Tshirts' ,
                'Men Shirts' ,
                'Men Jeans & Trousers' ,
                'Men Winterwear' ,
                'Men Perfumes' ,
                'Microwaves' ,
                'Men Shoes' ,
                'Men Casual Shoes' ,
                'Men Sports Shoes' ,
                'Men Formal Shoes' ,
                'Men Slippers & Flip-Flops' ,
                'Men Bags & Wallets' ,
                'Men Watches' ,
                'Product Feeds' ,
                'Power Banks' ,
                'Personal Care Appliances' ,
                'Refrigerators' ,
                'Room Heaters' ,
                'Speakers' ,
                'Smart Devices' ,
                'Smart Bands & Watches' ,
                'Skin Care' ,
                'Scrubs & Exfoliators' ,
                'Serums & Facial Oils' ,
                'Shampoos' ,
                'Shavers & Trimmers' ,
                'Televisions' ,
                'Tablets' ,
                'Top Picks' ,
                'Top Deals' ,
                'Vaccum Cleaners' ,
                'Women Clothing' ,
                'Women Tops & Tshirts' ,
                'Women Dresses' ,
                'Women Jeans & Trousers' ,
                'Women Ethnic Wear' ,
                'Women Winterwear' ,
                'Wipes' ,
                'Women Perfumes',
                'Washing Machines' ,
                'Water Heaters' ,
                'Water Purifiers' ,
                'Women Shoes' ,
                'Women Sandals' ,
                'Women Casual Shoes' ,
                'Women Handbags & Wallets',
                'Women Watches'

            ],
            message : "please select correct category for products"
        }
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
    
})

module.exports = mongoose.model("product",productSchema);