const User = require("../models/user");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

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

// Export all the controller functions so they can be hooked up to URLs in auth.routes.js
module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
};