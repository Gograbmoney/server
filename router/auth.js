const express = require('express')
require('../db/conn')
const router = express.Router()

const { authenticate, authorizeRole } = require('../middleware/authenticate')

const { createUser,
    loginUser,
    logoutUser,
    getDataUserProfile,
    contactUs,
    forgetPassword,
    resetPassword,
    updatePassword,
    updateProfile,
    getAllUsers,
    getUserDetails,
    updateProfileByAdmin,
    deleteUserByAdmin ,
    updatePaymentDetails,
    verifyOTP,
    resendOTP} = require('../controllers/authController')

router.route('/register').post(createUser);

router.route('/verifyotp').post(verifyOTP);

router.route('/resendotp').post(resendOTP);

router.route('/signin').post(loginUser);

router.route('/logout').get(logoutUser);

router.route('/me').get(authenticate, getDataUserProfile);

router.route('/me/update').put(authenticate, updateProfile);

router.route('/me/update/paymentdetails').put(authenticate, updatePaymentDetails);

router.route('/contact').post(authenticate, contactUs);

router.route('/password/forgot').post(forgetPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/password/update').put(authenticate, updatePassword);

router.route("/admin/users").get(authenticate, authorizeRole("admin"), getAllUsers);

router.route("/admin/user/:id").get(authenticate, authorizeRole("admin"), getUserDetails)
    .put(authenticate, authorizeRole("admin"), updateProfileByAdmin)
    .delete(authenticate, authorizeRole("admin"), deleteUserByAdmin);
module.exports = router;