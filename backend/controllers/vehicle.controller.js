const Vehicle = require("../models/Vehicle");

const addVehicle = async (req, res) => {
    try {
        const { name, brand, model, year, type, fuelType, transmission, pricePerDay, location } = req.body;

        if (!name || !brand || !model || !year || !type || !fuelType || !transmission || !pricePerDay || !location) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        let imageUrl = req.body.image || req.body.imageUrl || '';
        if (req.file) {
            imageUrl = req.file.path;
        }

        const vehicleData = {
            ...req.body,
            image: imageUrl,
            owner: req.user._id // Get owner ID from JWT token
        };
        const vehicle = await Vehicle.create(vehicleData);

        res.status(201).json({
            message: "Vehicle Added Successfully",
            vehicle
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find().populate('owner', 'name email');
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVehicleById = async (req, res) => {
    try {
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

const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Make sure only the owner or an admin can update
        if (vehicle.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "User not authorized to update this vehicle" });
        }

        let updateData = { ...req.body };
        if (req.body.imageUrl || req.body.image) {
            updateData.image = req.body.imageUrl || req.body.image;
        }
        if (req.file) {
            updateData.image = req.file.path;
        }

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

const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Make sure only the owner or an admin can delete
        if (vehicle.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "User not authorized to delete this vehicle" });
        }

        await vehicle.deleteOne();
        res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOwnerVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ owner: req.params.ownerId });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchVehicles = async (req, res) => {
    try {
        const { type, location, price, brand } = req.query;
        let query = {};

        if (type) query.type = { $regex: new RegExp(type, 'i') };
        if (location) query.location = { $regex: new RegExp(location, 'i') };
        if (brand) query.brand = { $regex: new RegExp(brand, 'i') };
        if (price) query.pricePerDay = { $lte: Number(price) };

        query.available = true; // Typically you'd only want to search available vehicles

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
