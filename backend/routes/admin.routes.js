const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    getAllVehicles,
    getAllBookings,
    deleteUser,
    deleteVehicle,
    getDashboardStats
} = require("../controllers/admin.controller");

const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

// Protect all admin routes and restrict to 'admin' role only
router.use(protect);
router.use(authorize("admin"));

router.get("/users", getAllUsers);
router.get("/vehicles", getAllVehicles);
router.get("/bookings", getAllBookings);
router.delete("/user/:id", deleteUser);
router.delete("/vehicle/:id", deleteVehicle);
router.get("/dashboard", getDashboardStats);

module.exports = router;
