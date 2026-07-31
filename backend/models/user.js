// Import Mongoose to define the schema and model
const mongoose = require("mongoose");

// A Schema defines the strict structure (blueprint) of a document in the MongoDB collection.
// It enforces data types, validation rules, and default values.
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // The database will throw an error if a user tries to register without a name
            trim: true      // Automatically removes leading and trailing spaces (e.g. "  Allen  " becomes "Allen")
        },

        email: {
            type: String,
            required: true,
            unique: true,   // Ensures no two users can register with the exact same email address
            lowercase: true // Automatically converts "Allen@Email.com" to "allen@email.com" before saving
        },

        password: {
            type: String,
            required: false  // Optional because Google users won't have a password initially
        },

        googleId: {
            type: String,
            required: false // Only present for users who sign up with Google
        },

        resetPasswordToken: String,
        resetPasswordExpire: Date,

        role: {
            type: String,
            // enum restricts the role to ONLY these three specific strings. Any other value will be rejected.
            enum: ["customer", "owner", "admin"],
            default: "customer" // If no role is provided during registration, they default to a basic customer
        }
    },
    {
        // This automatically adds 'createdAt' and 'updatedAt' timestamp fields to every user document
        timestamps: true
    }
);

// We compile the Schema into a Model. 
// A Model is a special class we use to query the database (e.g. User.find(), User.create()).
// Mongoose will automatically pluralize the name to create a collection called "users" in MongoDB.
module.exports = mongoose.model("User", userSchema);