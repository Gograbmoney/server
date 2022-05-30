const bcrypt = require('bcryptjs')
require('../db/conn')
const User = require('../models/userSchema')
const userOtpVarification = require('../models/userOtpVarification')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

// to test server configuration
exports.demo = (req, res) => {
       res.send("Gograbmoney server is running..... ")
}
// Create a new User 

exports.createUser = async (req, res) => {

    const { name, email, mobile, password, cpassword } = req.body

    if (!name || !email || !mobile || !password || !cpassword) {
        return res.status(400).json({ error: 'PLZ Fill all the details' })
    }

    try {
        const UserExist = await User.findOne({ email: email })

        if (UserExist) {
            res.status(400).json({ error: 'User already exist' })
        }
        const user = new User({ name, email, mobile, password, cpassword })

        //saves the data into db but first checks the decrypt in userSchema
        await user.save()

        UserOTPVarificationEmail(user, res);

        res.status(200).json({ message: 'User registered Successfully !!! ' })
    }
    catch (err) {
        console.log(err)
    }
}

// otp varification
const UserOTPVarificationEmail = async (user, res) => {
    try {
        const otp = `${math.floor(1000 + Math.random() * 9000)}`

        //mail options
        const mailOptions = {
            from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
            to: user.email,
            subject: "Verify your email",
            html: `<p>Enter <b>${otp}</b> to verify your email address and complete registration</p>
                   <p>This code <b>Expire in 1 Hour</b>.</p>`
        }


        // hash the otp 
        const saltRound = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRound)

        const newOTPVarification = await new userOtpVarification({
            userId: user._id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600 * 1000
        })

        // save OTP information
        await newOTPVarification.save();

        await sendEmail(mailOptions);
        res.json({
            status: 'pending',
            message: "Verification OTP send to email address",
            data: {
                userId: user._id,
                email: user.email
            }
        })

    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message
        })
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        let { userId, otp } = req.body;

        if (!userId || !otp) {
            throw new Error("Empty OTP is not alowed");
        }
        else {
            const userOTPVarificationRecord = await userOtpVarification.find({ userId });
            if (userOTPVarificationRecord.length <= 0) {
                //no record found
                throw new Error("Account record does'nt exist or has been already vrified .Please Sign Up or Login");
            }
            else {
                //user otp record exist
                const expiresAt = userOTPVarificationRecord[0].otp;

                if (expiresAt < Date.now()) {
                   //user otp record has expired
                   await userOtpVarification.deleteMany({userId});
                   throw new Error("Code has expire. Please request again.");
                }
                else {
                   const validOTP= await bcrypt.compare(otp,hashedOTP);

                   if(!validOTP){
                       //suplied otp is wrong
                       throw new Error("Invalid otp. Please Check your Inbox");
                   }
                   else {
                       //success
                       await User.updateOne({_id,userId},{varified:true});
                       await userOtpVarification.deleteMany({userId});

                       res.json({
                           status: 'VARIFIED',
                           message: "User email varified successfully "
                       })
                   }
                }

            }
        }
    } catch (error) {
        res.json({
            status: 'FAILED',
            message: error.message
        })
    }
}

exports.resendOTP = async (req, res) => {
    try {
        let {userId,email} = req.body;

        if(!userId || !email) {
            throw new Error("Empty User Details are not allowed")
        }
        else{
            //delete existing record and resend
            await userOtpVarification.deleteMany({userId});
            UserOTPVarificationEmail({_id: userId,email},res)
        }
    } catch (error) {
        res.json({
            status: 'FAILED',
            message: error.message
        })
    }
}

// Login a user 

exports.loginUser = async (req, res) => {
    let token;

    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: 'Please fill all fields' })
        }

        const CheckLogin = await User.findOne({ email: email })

        //checks the email first later the password with isMatch, if not this
        //then the email error won't display
        console.log(CheckLogin)
        if (CheckLogin) {
            const isMatch = await bcrypt.compare(password, CheckLogin.password)

            token = await CheckLogin.generateAuthToken()
            console.log(token);

            //store in cookies

            res.cookie('jwtoken', token, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                httpOnly: true,
                secure : true,
                sameSite : "none"
            })
            if (!isMatch) {
                res.status(400).json({ error: 'Invalid Credentails' })
            } else {
                res.json({ message: 'User login successful !!!' })
            }
        }
        else {
            return res.status(400).json({ error: 'Please enter valid email' })
        }
    }
    catch (er) {
        console.log(er)
    }
}

// Logout the user 
exports.logoutUser = async (req, res) => {
    console.log('Logged out');
    res.clearCookie('jwtoken', { path: '/' })
    res.status(200).send('Logged out Successfully')
}

// to get data of logged user profile
exports.getDataUserProfile = async (req, res) => {

    res.status(200).json({
        success: true,
        user: req.user
    })
}

//to contact us with admin

exports.contactUs = async (req, res) => {
    try {
        const { name, email, mobile, message } = req.body
        console.log(message)
        if (!name || !email || !mobile || !message) {
            console.log('Error in contact form');
            res.json({ message: 'Fill all the fields to contact us' })
        }
        const Usercontact = await User.findOne({ _id: req.id })
        if (Usercontact) {
            const Usermessage = await Usercontact.addMessage(name, email, mobile, message)
            await Usercontact.save()
            res.status(200).json({ message: 'YOur contact form reached Us' })
        }
    }
    catch (err) {
        console.log(err);
    }
}

// forget password reset

exports.forgetPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(
            res.status(404).json({ error: 'User not found with this email' })
        )
    }

    // create reset token

    const resetToken = user.getResetPasswordToken();
    console.log(resetToken);
    await user.save({ validateBeforeSave: false });

    // create reset password url

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    try {


        //mail options
        const mailOptions = {
            from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
            to: user.email,
            subject: "Reset Your Password",
            message: `Your password reset token is as follows:\n\n ${resetUrl}\n\nIf you have not requested this email , Then ignore it.`
        }

        await sendEmail(mailOptions);

        res.status(200).json({
            success: true,
            message: `Email sent to : ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        console.log('Error while sending email' + error);
        return next(error);
    }
}

// reset password

exports.resetPassword = async (req, res, next) => {
    // hash url token 
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(
            res.status(400).json({ error: 'Password reset token is invalid or has been expired' })
        )
    }

    if (req.body.password !== req.body.cpassword) {
        return next(
            res.status(400).json({ error: 'Password does not match' })
        )
    }

    // setup new password

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
}

// update password/change password

exports.updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    // check preveous user password

    const isMatch = await bcrypt.compare(req.body.currentpassword, user.password);

    if (!isMatch) {
        return next(
            res.status(404).json({
                success: false,
                message: "Current password is incorrect !!!"
            })
        );
    }

    user.password = req.body.password;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully!!!"
    })
}


// to update the user profile 

exports.updateProfile = async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        address: req.body.address

    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: true
    })
    res.status(200).json({
        success: true
    });
}

// to update paymentdetails details 
exports.updatePaymentDetails = async (req, res, next) => {

    const newUserData = {
        paymentdetails: {
            taxId: req.body.taxId,
            nameOfBank: req.body.nameOfBank,
            bankCode: req.body.bankCode,
            accountNumber: req.body.accountNumber,
            nameOfAccount: req.body.nameOfAccount

        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: true
    })

    res.status(200).json({
        success: true,
        message: "Payment details updated successfully!!!"
    });
}

///////////////////////////////   admin routes    ///////////////////////////////////////// 


//get all users

exports.getAllUsers = async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
}

// get users details    

exports.getUserDetails = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new Error(`User does not found with id : ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user
    })
}

// to update the user profile by admin

exports.updateProfileByAdmin = async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: true
    })

    console.log(newUserData)
    res.status(200).json({
        success: true
    });
}


// delete  users by admin    

exports.deleteUserByAdmin = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new Error(`User does not found with id : ${req.params.id}`));
    }

    await User.deleteOne();

    res.status(200).json({
        success: true
    })
}