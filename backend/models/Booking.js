const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Refunded"],
            default: "Pending"
        },
        status: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected", "Cancelled", "Completed"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Booking", bookingSchema);
