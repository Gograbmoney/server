const mongoose = require('mongoose');

const userOtpVarificationSchema = mongoose.Schema({
    userId : String,
    hashedOTP : String,
    createdAt : Date,
    expiresAt : Date
});

const userOtpVarification = mongoose.model('userOTPVarification', userOtpVarificationSchema);

module.exports = userOtpVarification
