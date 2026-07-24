// Import Mongoose, the Object Data Modeling (ODM) library for MongoDB.
// It allows us to interact with the database using Javascript objects instead of raw Mongo queries.
const mongoose = require("mongoose");

// We declare an asynchronous function because connecting to a database takes time.
// We need to 'await' the result before moving on.
const connectDB = async () => {
    try {
        // Attempt to connect to the database using the connection string stored in the .env file.
        // process.env.MONGO_URI keeps our password secure and out of the source code.
        await mongoose.connect(process.env.MONGO_URI);

        // If the line above succeeds without throwing an error, we log a success message.
        console.log("✅ MongoDB Connected");
    } catch (error) {
        // If the connection fails (e.g. wrong password, database server is down), this catch block runs.
        console.error("❌ Database Connection Failed");
        console.error(error.message); // Print the exact reason it failed
        
        // process.exit(1) forcefully kills the Node.js server.
        // A status code of 1 means "Uncaught Fatal Exception".
        // There is no point running an API if it can't talk to its database.
        process.exit(1);
    }
};

// Export the function so it can be imported and executed inside server.js
module.exports = connectDB;