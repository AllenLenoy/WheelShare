const express = require("express");
const router = express.Router();

const {
    createBooking,
    getCustomerBookings,
    getOwnerBookings,
    getBookingDetails,
    updateBookingStatus
} = require("../controllers/booking.controller");

const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

// All booking routes require authentication
router.use(protect);

router.post("/", createBooking);
router.get("/my-bookings", getCustomerBookings);
router.get("/owner-bookings", authorize("owner", "admin"), getOwnerBookings);
router.get("/:id", getBookingDetails);
router.put("/:id/status", updateBookingStatus);
// Note: We are using a unified status update endpoint for both cancel (customer) and accept/reject (owner).

module.exports = router;
