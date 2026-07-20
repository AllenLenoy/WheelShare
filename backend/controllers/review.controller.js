const Review = require("../models/Review");
const Vehicle = require("../models/Vehicle");

const addReview = async (req, res) => {
    try {
        const { vehicleId, rating, comment } = req.body;

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        const existingReview = await Review.findOne({ user: req.user._id, vehicle: vehicleId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this vehicle" });
        }

        const review = await Review.create({
            user: req.user._id,
            vehicle: vehicleId,
            rating,
            comment
        });

        res.status(201).json({
            message: "Review added successfully",
            review
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVehicleReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ vehicle: req.params.vehicleId })
            .populate('user', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to update this review" });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        await review.save();

        res.json({ message: "Review updated successfully", review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }

        await review.deleteOne();

        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addReview,
    getVehicleReviews,
    updateReview,
    deleteReview
};
