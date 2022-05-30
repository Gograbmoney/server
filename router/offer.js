const express = require('express')
const router = express.Router()

const {authorizeRole} = require('../middleware/authenticate')

const {newOffer , getOffer ,getSingleOffer, updateOffer ,deleteOffer } = require("../controllers/offerController");

router.route("/admin/offer/new").post(authorizeRole("admin"),newOffer);

router.route("/offer").get(getOffer);

router.route("/offer/:id").get(getSingleOffer);

router.route("/admin/offer/:id").put(authorizeRole("admin"),updateOffer);

router.route("/admin/offer/:id").delete(authorizeRole("admin"),deleteOffer);

module.exports = router;