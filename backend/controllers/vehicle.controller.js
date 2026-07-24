const Vehicle = require("../models/Vehicle");

// ==========================================
// ADD VEHICLE CONTROLLER
// ==========================================
// Handles POST /api/vehicles
// Protected Route: Only Owners and Admins can access this.
const addVehicle = async (req, res) => {
    try {
        // 1. Destructure all the text fields from the request body
        const { name, brand, model, year, type, fuelType, transmission, pricePerDay, location } = req.body;

        // 2. Validation: Ensure no required fields are missing
        if (!name || !brand || !model || !year || !type || !fuelType || !transmission || !pricePerDay || !location) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // 3. Handle the Image Upload
        // If the user provided an image URL as a string, use it.
        let imageUrl = req.body.image || req.body.imageUrl || '';
        
        // However, if the user actually uploaded a file (processed by the Multer middleware),
        // Multer-Storage-Cloudinary will have uploaded it to the cloud and attached the public URL to 'req.file.path'.
        // We overwrite the imageUrl with this Cloudinary link.
        if (req.file) {
            imageUrl = req.file.path;
        }

        // 4. Construct the final vehicle object
        const vehicleData = {
            ...req.body,
            image: imageUrl,
            // Automatically assign the logged-in user as the owner of this vehicle.
            // req.user._id is available because the auth.middleware runs before this controller.
            owner: req.user._id 
        };
        
        // 5. Save it to MongoDB
        const vehicle = await Vehicle.create(vehicleData);

        res.status(201).json({
            message: "Vehicle Added Successfully",
            vehicle
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// GET ALL VEHICLES CONTROLLER
// ==========================================
// Handles GET /api/vehicles (Public route)
const getAllVehicles = async (req, res) => {
    try {
        // Fetch all vehicles from the database.
        // .populate() is like a SQL JOIN. Instead of just returning the owner's ObjectId string,
        // it fetches the actual User document and replaces the ID with the user's 'name' and 'email'.
        const vehicles = await Vehicle.find().populate('owner', 'name email');
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// GET SINGLE VEHICLE CONTROLLER
// ==========================================
// Handles GET /api/vehicles/:id (Public route)
const getVehicleById = async (req, res) => {
    try {
        // Fetch one specific vehicle using the ID from the URL parameter (req.params.id)
        const vehicle = await Vehicle.findById(req.params.id).populate('owner', 'name email');
        if (vehicle) {
            res.json(vehicle);
        } else {
            res.status(404).json({ message: "Vehicle not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// UPDATE VEHICLE CONTROLLER
// ==========================================
// Handles PUT /api/vehicles/:id
const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Security Check: Only the specific owner of THIS vehicle (or an admin) is allowed to edit it.
        // We use .toString() because Mongoose ObjectIds are objects, not plain strings.
        if (vehicle.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "User not authorized to update this vehicle" });
        }

        let updateData = { ...req.body };
        
        // Handle image updates the same way we did in addVehicle
        if (req.body.imageUrl || req.body.image) {
            updateData.image = req.body.imageUrl || req.body.image;
        }
        if (req.file) {
            updateData.image = req.file.path;
        }

        // Apply the updates to the database
        // { new: true } tells Mongoose to return the updated document, rather than the old one
        // { runValidators: true } ensures the updated data still follows the Schema rules
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            message: "Vehicle updated successfully",
            vehicle: updatedVehicle
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// DELETE VEHICLE CONTROLLER
// ==========================================
// Handles DELETE /api/vehicles/:id
const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Security Check: Only the specific owner of THIS vehicle (or an admin) is allowed to delete it.
        if (vehicle.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "User not authorized to delete this vehicle" });
        }

        await vehicle.deleteOne();
        res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// GET OWNER'S VEHICLES CONTROLLER
// ==========================================
// Handles GET /api/vehicles/owner/:ownerId
const getOwnerVehicles = async (req, res) => {
    try {
        // Find all vehicles where the 'owner' field matches the ID passed in the URL
        const vehicles = await Vehicle.find({ owner: req.params.ownerId });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// SEARCH VEHICLES CONTROLLER
// ==========================================
// Handles GET /api/vehicles/search?type=Car&price=5000
const searchVehicles = async (req, res) => {
    try {
        // 1. Destructure the query parameters from the URL
        const { type, location, price, brand } = req.query;
        let query = {};

        // 2. Build the MongoDB query object dynamically based on what the user searched for
        // We use $regex with 'i' (case-insensitive) so searching "london" matches "London".
        if (type) query.type = { $regex: new RegExp(type, 'i') };
        if (location) query.location = { $regex: new RegExp(location, 'i') };
        if (brand) query.brand = { $regex: new RegExp(brand, 'i') };
        
        // $lte means "Less Than or Equal To". So we only show cars cheaper than the max price.
        if (price) query.pricePerDay = { $lte: Number(price) };

        // 3. Always filter out vehicles that are currently unavailable
        query.available = true; 

        const vehicles = await Vehicle.find(query).populate('owner', 'name');
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    getOwnerVehicles,
    searchVehicles
};
