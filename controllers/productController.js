const Product = require("../models/productSchema");

const APIFeatures = require("../utils/apiFeatures");
// create new products = api/v1/admin/product/new
exports.newProduct = async (req, res, next) => {

    req.body.user = req.body.id;
    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product
    })
}

// get product = api/v1/products?keyword=apple
exports.getProducts = async (req, res, next) => {
    const resPerPage = 20;
    const productCount = await Product.countDocuments();
    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resPerPage)

    const products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        count: products.length,
        productCount,
        products
    })
}

// get single product = api/v1/product/:id

exports.getSingleProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "product not found"
        })
    }

    res.status(200).json({
        success: true,
        product
    })
}

// to update product = api/v1/admin/product/:id

exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: true
    });
    res.status(200).json({
        success: true,
        product
    })
}

// to delete product = api/v1/admin/product/:id

exports.deleteProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "product not found"
        })
    }

    await Product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product removed successfully"
    })
}