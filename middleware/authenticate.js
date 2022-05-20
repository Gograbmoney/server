const jwt = require('jsonwebtoken')
const User = require('../models/userSchema')


// varifying that user is login or not
exports.authenticate = async (req, res, next) => {

    try {

        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findOne({ _id: verifyToken._id })     // "tokens.token": token

        if (!user) { throw new Error('User not found') }

        req.token = token;
        req.user = user;
        req.id = user._id;
        next();
    }
    catch (err) {
        res.status(400).send('Unauthorized : Token not found')
        console.log(err)
    }
}

// authorization of user role
exports.authorizeRole = (...role) => {
    
   return (req, res,next) => {
       if(!role.includes(req.user.role)){

           return next(
             new Error(`Role ${req.user.role} is not allowed to access this resource`)
           )
       }
       next();
   }
}
// module.exports = authenticate;