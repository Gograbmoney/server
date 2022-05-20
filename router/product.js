const express = require('express')
const router = express.Router()

const {authorizeRole} = require('../middleware/authenticate')

const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct } = require("../controllers/productController");

router.route("/products").get(getProducts);

router.route("/admin/products/new").post(authorizeRole("admin"),newProduct);

router.route("/products/:id").get(getSingleProduct);

router.route("/admin/products/:id").put(authorizeRole("admin"),updateProduct);

router.route("/admin/products/:id").delete(authorizeRole("admin"),deleteProduct);


module.exports = router;