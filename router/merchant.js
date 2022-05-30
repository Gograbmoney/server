const express = require('express')
const router = express.Router()

const {authorizeRole} = require('../middleware/authenticate')

const {newMerchant , getMerchant ,getSingleMerchant, updateMerchant ,deleteMerchant } = require("../controllers/merchentController");

router.route("/admin/merchant/new").post(authorizeRole("admin"),newMerchant);

router.route("/merchant").get(getMerchant);

router.route("/merchant/:id").get(getSingleMerchant);

router.route("/admin/merchant/:id").put(authorizeRole("admin"),updateMerchant);

router.route("/admin/merchant/:id").delete(authorizeRole("admin"),deleteMerchant);

module.exports = router;