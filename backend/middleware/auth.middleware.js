const jwt = require('jsonwebtoken');
const User = require('../models/user');

// ==========================================
// PROTECT ROUTE MIDDLEWARE
// ==========================================
// This function runs BEFORE protected controllers (like creating a booking or viewing a profile).
// Its job is to verify that the user making the request has a valid, unexpired JSON Web Token.
const protect = async (req, res, next) => {
    let token;

    // 1. Check if the HTTP request contains an 'Authorization' header, 
    // and that it starts with the word 'Bearer' (the standard format for JWTs).
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 2. Extract just the token string. 
            // The header looks like: "Bearer abc.123.xyz"
            // .split(' ')[1] splits it by the space and grabs the second part (the token itself).
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify the token's authenticity using our secret key.
            // If the token was tampered with or has expired, jwt.verify() will throw an error and jump to the catch block.
            // If it is valid, it decodes the payload, which contains the user's database ID ({ id: "..." }).
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

            // 4. Fetch the full user document from MongoDB using the decoded ID.
            // We use .select('-password') to ensure we don't accidentally attach the password hash to the request.
            // By assigning this to 'req.user', EVERY controller that runs after this middleware will have instant access to the logged-in user's data.
            req.user = await User.findById(decoded.id).select('-password');

            // 5. Call next() to pass control to the actual controller function (e.g. createBooking).
            next();
        } catch (error) {
            console.error(error);
            // If verification fails, return a 401 Unauthorized status and stop execution.
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // 6. If there was no Authorization header at all, block the request immediately.
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
