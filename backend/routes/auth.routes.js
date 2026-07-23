const express = require("express");

const router = express.Router();

const { register, login, getProfile, updateProfile, changePassword } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 auth requests per window
    message: "Too many login attempts from this IP, please try again after 15 minutes."
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;