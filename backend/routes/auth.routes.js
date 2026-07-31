const express = require("express");

// Creates a new Express Router object. 
// A router is like a "mini-application" that only handles routing logic.
const router = express.Router();

// Import the controller functions (the actual business logic)
const { register, login, getProfile, updateProfile, changePassword } = require("../controllers/auth.controller");

// Import the middleware used to secure routes
const { protect } = require("../middleware/auth.middleware");

// Import rate limiting specifically for auth routes
const rateLimit = require("express-rate-limit");

// ==========================================
// AUTH RATE LIMITER
// ==========================================
// We have a 'globalLimiter' in server.js that allows 100 requests per 15 minutes.
// However, login routes are vulnerable to "Brute Force Attacks" (where hackers use a bot to guess passwords rapidly).
// To prevent this, we create a much stricter rule just for login/register: Maximum 10 attempts per 15 minutes.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 auth requests per window
    message: "Too many login attempts from this IP, please try again after 15 minutes."
});

// ==========================================
// ROUTE DEFINITIONS
// ==========================================
// The format is: router.[HTTP_METHOD]("/path", [middleware1, middleware2...], controllerFunction)

// PUBLIC ROUTES: Anyone can access these. We apply the strict authLimiter here.
// Note: In server.js, this router is mounted at "/api/auth", so the full URL is POST /api/auth/register
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

// Google Auth Route
const { googleAuth, forgotPassword, resetPassword } = require("../controllers/auth.controller");
router.post("/google", googleAuth);

// Password Reset Routes
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

// PROTECTED ROUTES: You must be logged in to access these.
// We apply the 'protect' middleware. If the user doesn't have a valid JWT token, 'protect' will block the request and send a 401 error.
// If they DO have a valid token, 'protect' will let the request pass through to the controller (e.g. getProfile).
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

// Export the router so it can be 'mounted' in server.js
module.exports = router;