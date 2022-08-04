const Merchant = require("../models/merchantSchema");

const APIFeatures = require("../utils/apiFeatures");

// to create merchant 

exports.newMerchant = async (req, res, next) => {

    req.body.user = req.body.id;
    const merchant = await Merchant.create(req.body)

    res.status(201).json({
        success: true,
        merchant
    })
}

// to get merchant

exports.getMerchant = async (req, res, next) => {
    const resPerPage = 16;
    const merchantCount = await Merchant.countDocuments();
    const categoryCount = await Merchant.countDocuments({category : req.query.category});
    const apiFeatures = new APIFeatures(Merchant.find(), req.query)
        .search()
        .filter()
        .pagination(resPerPage)

    const searchResult = new APIFeatures(Merchant.find(),req.query).search()
    const searchResultCount = await searchResult.query;

    const merchant = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: merchant.length,
        merchantCount,
        resPerPage,
        merchant,
        categoryCount,
        searchResultCount : searchResultCount.length
    })
}

// to get single merchant

exports.getSingleMerchant = async (req, res, next) => {
    const merchant = await Merchant.findById(req.params.id);
    if (!merchant) {
        return res.status(404).json({
            success: false,
            message: "merchant not found"
        })
    }

    res.status(200).json({
        success: true,
        merchant
    })
}

// to update merchant

exports.updateMerchant = async (req, res, next) => {
    let merchant = await Merchant.findById(req.params.id);
    if (!merchant) {
        return res.status(404).json({
            success: false,
            message: "merchant not found"
        })
    }

    merchant = await Merchant.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: true
    });
    res.status(200).json({
        success: true,
        merchant
    })
}

// to delete merchant

exports.deleteMerchant = async (req, res, next) => {
    let merchant = await Merchant.findById(req.params.id);

    if (!merchant) {
        return res.status(404).json({
            success: false,
            message: "merchant not found"
        })
    }

    await Merchant.deleteOne();

    res.status(200).json({
        success: true,
        message: "Merchant removed successfully"
    })
}
