const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");

const createBooking = async (req, res) => {
    try {
        const { vehicleId, startDate, endDate, totalPrice, paymentStatus } = req.body;
        
        if (!vehicleId || !startDate || !endDate || !totalPrice) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        const booking = await Booking.create({
            customer: req.user._id,
            vehicle: vehicleId,
            owner: vehicle.owner,
            startDate,
            endDate,
            totalPrice,
            paymentStatus: paymentStatus || "Pending",
            status: "Pending"
        });

        res.status(201).json({
            message: "Booking created successfully",
            booking
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCustomerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ customer: req.user._id }).populate('vehicle');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOwnerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ owner: req.user._id }).populate('vehicle').populate('customer', 'name email');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBookingDetails = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('vehicle')
            .populate('customer', 'name email')
            .populate('owner', 'name email');
            
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Only allow customer, owner, or admin to view
        if (booking.customer._id.toString() !== req.user._id.toString() &&
            booking.owner._id.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to view this booking" });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check permissions: Owner can accept/reject, Customer can cancel
        if (req.user.role === 'customer' && status === 'Cancelled') {
            if (booking.customer.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Not authorized" });
            }
        } else if (req.user.role === 'owner') {
            if (booking.owner.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Not authorized" });
            }
            if (!['Accepted', 'Rejected', 'Completed'].includes(status)) {
                return res.status(400).json({ message: "Invalid status update for owner" });
            }
        } else if (req.user.role !== 'admin') {
             return res.status(403).json({ message: "Not authorized" });
        }

        booking.status = status;
        await booking.save();

        res.json({ message: "Booking status updated", booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getCustomerBookings,
    getOwnerBookings,
    getBookingDetails,
    updateBookingStatus
};
