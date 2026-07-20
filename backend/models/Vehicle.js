const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
{
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    name:{
        type:String,
        required:true
    },

    brand:{
        type:String,
        required:true
    },

    model:{
        type:String,
        required:true
    },

    year:{
        type:Number,
        required:true
    },

    type:{
        type:String,
        enum:["Car","Bike","Scooter"],
        required:true
    },

    fuelType:{
        type:String,
        enum:["Petrol","Diesel","Electric","Hybrid"],
        required:true
    },

    transmission:{
        type:String,
        enum:["Manual","Automatic"],
        required:true
    },

    pricePerDay:{
        type:Number,
        required:true
    },

    location:{
        type:String,
        required:true
    },

    image:{
        type:String,
        default:""
    },

    available:{
        type:Boolean,
        default:true
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("Vehicle",vehicleSchema);
