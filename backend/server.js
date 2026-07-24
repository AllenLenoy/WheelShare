// 1. IMPORTING CORE PACKAGES
// ==========================================
// Express is the web framework that handles all the HTTP requests and routing for our backend API.
const express = require("express"); 

// CORS (Cross-Origin Resource Sharing) prevents the browser from blocking requests made from our Angular frontend (port 4200/8080) to our Node backend (port 5000).
const cors = require("cors"); 

// Helmet is a security package. It automatically adds 15+ HTTP headers to our responses to protect against web vulnerabilities like clickjacking and XSS.
const helmet = require("helmet"); 

// express-rate-limit is used to prevent abuse (like DDoS attacks or brute forcing). It restricts how many times a single IP address can ping our server.
const rateLimit = require("express-rate-limit"); 

// express-mongo-sanitize removes '$' and '.' characters from incoming data to prevent NoSQL injection attacks (where hackers try to bypass database logic).
const mongoSanitize = require("express-mongo-sanitize"); 

// dotenv loads the secret variables (like our database password) from the hidden '.env' file into Node's 'process.env' object.
require("dotenv").config(); 


// 2. IMPORTING OUR CUSTOM ROUTE FILES
// ==========================================
// We split our routes into separate files so server.js doesn't become thousands of lines long.
const authRoutes = require("./routes/auth.routes");       // Handles login, register, profile
const vehicleRoutes = require("./routes/vehicle.routes"); // Handles adding, viewing, and searching cars
const bookingRoutes = require("./routes/booking.routes"); // Handles renting cars and updating booking status
const reviewRoutes = require("./routes/review.routes");   // Handles rating cars
const adminRoutes = require("./routes/admin.routes");     // Handles admin dashboard stats and user management

// Imports the function that connects to our MongoDB database
const connectDB = require("./config/db"); 


// 3. INITIALISING THE EXPRESS APPLICATION
// ==========================================
// This creates the actual server application instance. We will attach all our middleware and routes to this 'app' object.
const app = express(); 


// 4. CONNECTING TO THE DATABASE
// ==========================================
// Calls the function we imported above. This must happen before we try to save or fetch anything.
connectDB(); 


// 5. CONFIGURING MIDDLEWARE (The Request Pipeline)
// ==========================================
// Middleware are functions that run on EVERY incoming request before they reach the final route.

// First, we configure the rate limiter: limit each IP address to 100 requests every 15 minutes.
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Time window: 15 minutes in milliseconds
    max: 100,                 // Maximum 100 requests allowed in that window
    message: "Too many requests from this IP, please try again after 15 minutes." // Error message sent if they exceed the limit
});

// Now we tell the app to actually use these middleware tools in order:
app.use(helmet()); // 1st: Secure the HTTP headers immediately.
app.use(cors());   // 2nd: Allow the Angular frontend to connect.
app.use(express.json()); // 3rd: Parse incoming JSON data so we can read it in 'req.body'.

// Note: express-mongo-sanitize is currently disabled because the latest version of Express (v5.2) changed how 'req.query' works, causing a crash. In a real production app, we would patch this.
// app.use(mongoSanitize()); 

app.use(globalLimiter); // 4th: Apply the rate limit to all routes to protect the server from spam.


// 6. REGISTERING ROUTES
// ==========================================
// This acts as a switchboard. It maps a URL prefix to a specific file of routes.
// Example: If a request goes to 'http://localhost:5000/api/auth/login', it is sent to 'authRoutes'.
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);


// 7. TEST ROUTE
// ==========================================
// A simple health-check route at the root URL just to verify the server is turned on.
app.get("/", (req, res) => {
    res.send("🚗 WheelShare Backend is Running!");
});


// 8. GLOBAL ERROR HANDLER
// ==========================================
// If any controller crashes or throws an error, it gets sent down the pipeline to this function.
// Express knows this is an error handler because it has exactly 4 parameters (err, req, res, next).
app.use((err, req, res, next) => {
    console.error("Global Error:", err); // Log the error to the terminal for the developer
    
    // Set the HTTP status code (default to 500 if none was provided by the controller)
    const statusCode = err.statusCode || 500;
    // Set the error message
    const message = err.message || "Internal Server Error";
    
    // Send a clean, formatted JSON response back to the frontend instead of an ugly HTML crash page
    res.status(statusCode).json({
        success: false,
        message: message,
        // Only send the detailed stack trace (which file/line crashed) if we are in development mode. In production, this is a security risk.
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});


// 9. STARTING THE SERVER
// ==========================================
// Read the port from the .env file, or default to 5000 if it's missing.
const PORT = process.env.PORT || 5000;

// Tell the Express app to open the port and start listening for incoming HTTP requests.
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});