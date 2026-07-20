const express = require("express");
const router = express.Router();

const {
    addReview,
    getVehicleReviews,
    updateReview,
    deleteReview
} = require("../controllers/review.controller");

const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, addReview);
router.get("/vehicle/:vehicleId", getVehicleReviews);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
