
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator');
const crypto = require('crypto')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxlength: [30, "Your name must be at least 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email address"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid email address"]
    },
    mobile: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        default: ""
    },
    varified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Please enter at least 6 characters"]
    },
    cpassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    date: {
        type: Date,
        default: Date.now
    },
    paymentdetails: {
        taxId : { 
            type: String,
            default: ""
           
        },
        nameOfBank: {
            type: String,
            default: ""
        },
        bankCode: {
            type: String,
            default: ""
        },
        accountNumber :{
            type: Number,
            default: ""
        },
        nameOfAccount : {
            type: String,
            default: ""
        }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    messages: [
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            mobile: {
                type: Number,
                required: true
            },
            message: {
                type: String,
                required: true
            },
        }
    ]
    // tokens: [
    //     {
    //         token: {
    //             type: String,
    //             required: true
    //         }
    //     }
    // ]

})


//bcrypting data of pwd in hash

userSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        console.log('encrypted the data')
        this.password = await bcrypt.hash(this.password, 12)
        this.cpassword = await bcrypt.hash(this.cpassword, 12)
    }
    next()
})
// creating jwt token here and it will be used in auth
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        // this.tokens = this.tokens.concat({token:token})
        // await this.save()
        console.log(token);
        return token
    }
    catch (err) {
        console.log(err);
    }
}
// for adding messages 
userSchema.methods.addMessage = async function (name, email, mobile, message) {
    try {
        this.messages = this.messages.concat({ name, email, mobile, message })
        await this.save()
        return this.messages
    }
    catch (err) {
        console.log(err);
    }
}

// genarate password reset token 
userSchema.methods.getResetPasswordToken = function(){
    // genarate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hash and set to reset password token
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // set token expires time
    this.resetPasswordExpire = Date.now() + 30*60*1000; // in milliseconds
    return resetToken;
}

//collection(document) creation
const user = mongoose.model('User', userSchema)
module.exports = user