const User = require("../models/user");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const sendEmail = require("../utils/sendEmail");

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// ==========================================
// JWT GENERATOR UTILITY
// ==========================================
// This function creates a JSON Web Token when a user logs in or registers.
// It encodes the user's database ID inside the token. 
// The frontend will store this token and send it back on every request to prove they are logged in.
const generateToken = (id) => {
    // jwt.sign takes 3 arguments: the payload (data), the secret key (to prevent tampering), and options (like expiry).
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    });
};

// ==========================================
// REGISTER CONTROLLER
// ==========================================
// Handles POST /api/auth/register
const register = async (req, res) => {
    try {
        // 1. Destructure the data sent from the frontend HTML form
        const { name, email, password, role } = req.body;

        // 2. Check if a user with this email already exists in MongoDB
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // 400 Bad Request: Stop execution and tell frontend the email is taken
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // 3. Hash the password for security. NEVER store plain-text passwords.
        // '10' is the salt rounds. It determines how mathematically complex the hash is.
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create the new user document in the database
        const user = await User.create({
            name,
            email,
            password: hashedPassword, // Save the scrambled password, not the real one
            role
        });

        // 5. Send a 201 Created response back to the frontend, along with the newly generated JWT token.
        res.status(201).json({
            message: "User Registered Successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            }
        });

    } catch (error) {
        // If anything crashes (e.g. database goes offline), send a 500 Internal Server Error
        res.status(500).json({
            message: error.message
        });
    }
};

// ==========================================
// LOGIN CONTROLLER
// ==========================================
// Handles POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user by their email address
        const user = await User.findOne({ email });

        // 2. Verify the user exists AND that the passwords match.
        // bcrypt.compare() checks the plain-text input against the hashed password stored in MongoDB.
        if (user && (await bcrypt.compare(password, user.password))) {
            // Success! Send back the user data and a new JWT token
            res.json({
                message: "User Logged In Successfully",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id)
                }
            });
        } else {
            // 401 Unauthorized: Generic error message so hackers don't know if the email or the password was wrong
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// GET PROFILE CONTROLLER
// ==========================================
// Handles GET /api/auth/profile
// Note: This route is protected by auth.middleware.js, which means `req.user` is already injected.
const getProfile = async (req, res) => {
    try {
        // Fetch the user from the database using the ID attached to the request by the middleware.
        // .select("-password") explicitly removes the password field from the result so it isn't sent to the frontend.
        const user = await User.findById(req.user._id).select("-password");
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// UPDATE PROFILE CONTROLLER
// ==========================================
// Handles PUT /api/auth/profile
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Update fields only if they were provided in the request body, otherwise keep the old values
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            // Save the updated document back to MongoDB
            const updatedUser = await user.save();

            // Send back the updated data and a fresh token
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// CHANGE PASSWORD CONTROLLER
// ==========================================
// Handles PUT /api/auth/change-password
const changePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            const { oldPassword, newPassword } = req.body;

            // Verify they know their current password before allowing a change
            if (await bcrypt.compare(oldPassword, user.password)) {
                // Hash the new password and save it
                user.password = await bcrypt.hash(newPassword, 10);
                await user.save();
                res.json({ message: "Password updated successfully" });
            } else {
                res.status(401).json({ message: "Invalid old password" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// GOOGLE AUTH CONTROLLER
// ==========================================
const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;

        // Verify the token with Google
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // Update googleId if not present
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // Register new user
            user = await User.create({
                name,
                email,
                googleId,
                role: "customer"
            });
        }

        res.json({
            message: "Google Login Successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            }
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(401).json({ message: "Invalid Google Token" });
    }
};

// ==========================================
// FORGOT PASSWORD CONTROLLER
// ==========================================
const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: "There is no user with that email." });
        }

        // Get reset token
        const resetToken = crypto.randomBytes(20).toString("hex");

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Set expire (10 minutes)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Create reset URL
        const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${resetToken}`;

        const message = `
            You are receiving this email because you (or someone else) has requested the reset of a password.
            Please make a PUT request to: \n\n ${resetUrl}
            Or if on frontend, go to /auth/reset-password/${resetToken}
        `;

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Token",
                text: message,
            });

            res.json({ message: "Email sent" });
        } catch (error) {
            console.error(error);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            res.status(500).json({ message: "Email could not be sent" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// RESET PASSWORD CONTROLLER
// ==========================================
const resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.resettoken)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        if (!req.body.password) {
            return res.status(400).json({ message: "Please provide a new password" });
        }

        // Set new password
        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({
            message: "Password reset successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export all the controller functions so they can be hooked up to URLs in auth.routes.js
module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    googleAuth,
    forgotPassword,
    resetPassword
};