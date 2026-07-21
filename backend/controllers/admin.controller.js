const User = require("../models/user");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('vehicle')
            .populate('customer', 'name email')
            .populate('owner', 'name email');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await user.deleteOne();
        res.json({ message: "User deleted successfully" });
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
        await vehicle.deleteOne();
        res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.role = req.body.role || user.role;
        await user.save();
        res.json({ message: "Role updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const vehicleCount = await Vehicle.countDocuments();
        const bookingCount = await Booking.countDocuments();
        const completedBookings = await Booking.find({ status: 'Completed' });
        
        const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

        res.json({
            totalUsers: userCount,
            totalVehicles: vehicleCount,
            totalBookings: bookingCount,
            totalRevenue: totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getAllVehicles,
    getAllBookings,
    deleteUser,
    deleteVehicle,
    updateUserRole,
    getDashboardStats
};
