const Offer = require("../models/offerSchema");

const APIFeatures = require("../utils/apiFeatures");

// to create Offer

exports.newOffer = async (req, res, next) => {

    req.body.user = req.body.id;
    const offer = await Offer.create(req.body)

    res.status(201).json({
        success: true,
        offer
    })
}

// to get Offer

exports.getOffer = async (req, res, next) => {
    const resPerPage = 200;
    const offerCount = await Offer.countDocuments();
    const apiFeatures = new APIFeatures(Offer.find(), req.query)
        .search()
        .filter()
        .pagination(resPerPage)

    const offer = await apiFeatures.query;
    res.status(200).json({
        success: true,
        count: offer.length,
        offerCount,
        offer
    })
}

// to get single Offer

exports.getSingleOffer = async (req, res, next) => {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
        return res.status(404).json({
            success: false,
            message: "Offer not found"
        })
    }

    res.status(200).json({
        success: true,
        offer
    })
}

// to update Offer

exports.updateOffer = async (req, res, next) => {
    let offer = await Offer.findById(req.params.id);
    if (!offer) {
        return res.status(404).json({
            success: false,
            message: "Offer not found"
        })
    }

    offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: true
    });
    res.status(200).json({
        success: true,
        offer
    })
}

// to delete Offer

exports.deleteOffer = async (req, res, next) => {
    let offer = await Offer.findById(req.params.id);

    if (!offer) {
        return res.status(404).json({
            success: false,
            message: "Offer not found"
        })
    }

    await Offer.deleteOne();

    res.status(200).json({
        success: true,
        message: "Offer removed successfully"
    })
}