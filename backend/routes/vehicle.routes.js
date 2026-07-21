const express = require("express");
const router = express.Router();

const {
    addVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    getOwnerVehicles,
    searchVehicles
} = require("../controllers/vehicle.controller");

const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const { upload } = require("../config/cloudinary");

// Public routes
router.get("/", getAllVehicles);
router.get("/search", searchVehicles);
router.get("/:id", getVehicleById);
router.get("/owner/:ownerId", getOwnerVehicles);

// Protected routes (Owner and Admin only for modifications)
router.post("/", protect, authorize("owner", "admin"), upload.single("image"), addVehicle);
router.put("/:id", protect, authorize("owner", "admin"), upload.single("image"), updateVehicle);
router.delete("/:id", protect, authorize("owner", "admin"), deleteVehicle);

module.exports = router;
