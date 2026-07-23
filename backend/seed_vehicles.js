const mongoose = require("mongoose");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const User = require("./models/User");
const Vehicle = require("./models/Vehicle");
const bcrypt = require("bcryptjs");

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        // Clear existing vehicles
        await Vehicle.deleteMany({});
        console.log("Cleared existing vehicles.");

        // Find or create an owner user
        let owner = await User.findOne({ email: "owner_seed@wheelshare.com" });
        if (!owner) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("password123", salt);
            owner = await User.create({
                name: "Seed Owner",
                email: "owner_seed@wheelshare.com",
                password: hashedPassword,
                role: "owner"
            });
            console.log("Created seed owner.");
        }

        const vehiclesData = [
            {
                name: "Honda City 2022", brand: "Honda", model: "City", year: 2022,
                type: "Car", fuelType: "Petrol", transmission: "Automatic", pricePerDay: 2500,
                location: "Delhi", seats: 5, description: "A comfortable and reliable sedan perfect for city driving and long trips.",
                wikiTitle: "Honda City"
            },
            {
                name: "Toyota Innova Crysta", brand: "Toyota", model: "Innova Crysta", year: 2021,
                type: "Car", fuelType: "Diesel", transmission: "Manual", pricePerDay: 4000,
                location: "Delhi", seats: 7, description: "Spacious 7-seater MPV for family trips and outstation travels.",
                wikiTitle: "Toyota Innova"
            },
            {
                name: "Hyundai Creta", brand: "Hyundai", model: "Creta", year: 2023,
                type: "Car", fuelType: "Petrol", transmission: "Automatic", pricePerDay: 3000,
                location: "Delhi", seats: 5, description: "Premium compact SUV loaded with features and a panoramic sunroof.",
                wikiTitle: "Hyundai Creta"
            },
            {
                name: "Tata Nexon EV", brand: "Tata", model: "Nexon", year: 2023,
                type: "Car", fuelType: "Electric", transmission: "Automatic", pricePerDay: 2800,
                location: "Delhi", seats: 5, description: "Go green with this powerful and silent electric SUV.",
                wikiTitle: "Tata Nexon"
            },
            {
                name: "Mahindra Thar", brand: "Mahindra", model: "Thar", year: 2022,
                type: "Car", fuelType: "Diesel", transmission: "Manual", pricePerDay: 4500,
                location: "Delhi", seats: 4, description: "The ultimate 4x4 off-roader for the adventure enthusiast.",
                wikiTitle: "Mahindra Thar"
            },
            {
                name: "Maruti Suzuki Swift", brand: "Maruti Suzuki", model: "Swift", year: 2021,
                type: "Car", fuelType: "Petrol", transmission: "Manual", pricePerDay: 1500,
                location: "Delhi", seats: 5, description: "Zippy and economical hatchback for daily commuting.",
                wikiTitle: "Suzuki Swift"
            },
            {
                name: "Royal Enfield Classic 350", brand: "Royal Enfield", model: "Classic 350", year: 2022,
                type: "Bike", fuelType: "Petrol", transmission: "Manual", pricePerDay: 1000,
                location: "Delhi", seats: 2, description: "Iconic cruiser bike for an authentic riding experience.",
                wikiTitle: "Royal Enfield Classic"
            },
            {
                name: "Honda Activa 6G", brand: "Honda", model: "Activa 6G", year: 2023,
                type: "Scooter", fuelType: "Petrol", transmission: "Automatic", pricePerDay: 500,
                location: "Delhi", seats: 2, description: "Reliable and convenient scooter for quick local errands.",
                wikiTitle: "Honda Activa"
            },
            // Kochi
            {
                name: "Toyota Fortuner", brand: "Toyota", model: "Fortuner", year: 2021,
                type: "Car", fuelType: "Diesel", transmission: "Automatic", pricePerDay: 6000,
                location: "Kochi", seats: 7, description: "Luxurious and rugged 7-seater SUV for premium travel.",
                wikiTitle: "Toyota Fortuner"
            },
            {
                name: "Kia Seltos", brand: "Kia", model: "Seltos", year: 2022,
                type: "Car", fuelType: "Petrol", transmission: "Automatic", pricePerDay: 3200,
                location: "Kochi", seats: 5, description: "Stylish and feature-packed compact SUV.",
                wikiTitle: "Kia Seltos"
            },
            {
                name: "Honda Amaze", brand: "Honda", model: "Amaze", year: 2020,
                type: "Car", fuelType: "Petrol", transmission: "Manual", pricePerDay: 1800,
                location: "Kochi", seats: 5, description: "Compact sedan offering great comfort and fuel efficiency.",
                wikiTitle: "Honda Amaze"
            },
            {
                name: "Renault Duster", brand: "Renault", model: "Duster", year: 2019,
                type: "Car", fuelType: "Diesel", transmission: "Manual", pricePerDay: 2200,
                location: "Kochi", seats: 5, description: "Capable compact SUV for both city and highway drives.",
                wikiTitle: "Dacia Duster"
            },
            {
                name: "Volkswagen Polo", brand: "Volkswagen", model: "Polo", year: 2021,
                type: "Car", fuelType: "Petrol", transmission: "Manual", pricePerDay: 2000,
                location: "Kochi", seats: 5, description: "Premium hatchback with excellent driving dynamics.",
                wikiTitle: "Volkswagen Polo"
            },


            // Hyderabad
            {
                name: "Mahindra XUV700", brand: "Mahindra", model: "XUV700", year: 2023,
                type: "Car", fuelType: "Diesel", transmission: "Automatic", pricePerDay: 5000,
                location: "Hyderabad", seats: 7, description: "Tech-loaded SUV with ADAS and panoramic sunroof.",
                wikiTitle: "Mahindra XUV700"
            },
            {
                name: "MG Hector", brand: "MG", model: "Hector", year: 2021,
                type: "Car", fuelType: "Petrol", transmission: "Automatic", pricePerDay: 3500,
                location: "Hyderabad", seats: 5, description: "Spacious internet SUV with premium interiors.",
                wikiTitle: "MG Hector"
            },

            {
                name: "Tata Harrier", brand: "Tata", model: "Harrier", year: 2022,
                type: "Car", fuelType: "Diesel", transmission: "Manual", pricePerDay: 3800,
                location: "Hyderabad", seats: 5, description: "Bold and muscular SUV built on Land Rover architecture.",
                wikiTitle: "Tata Harrier"
            },
            {
                name: "Maruti Suzuki Baleno", brand: "Maruti Suzuki", model: "Baleno", year: 2023,
                type: "Car", fuelType: "Petrol", transmission: "Automatic", pricePerDay: 1800,
                location: "Hyderabad", seats: 5, description: "Premium and spacious hatchback.",
                wikiTitle: "Suzuki Baleno (2015)"
            },

            {
                name: "KTM Duke 390", brand: "KTM", model: "Duke", year: 2022,
                type: "Bike", fuelType: "Petrol", transmission: "Manual", pricePerDay: 1500,
                location: "Hyderabad", seats: 2, description: "Aggressive naked sports bike for the thrill.",
                wikiTitle: "KTM 390 Duke"
            },
            {
                name: "TVS Jupiter", brand: "TVS", model: "Jupiter", year: 2021,
                type: "Scooter", fuelType: "Petrol", transmission: "Automatic", pricePerDay: 500,
                location: "Hyderabad", seats: 2, description: "Zyada ka fayda! Comfortable daily commuter.",
                wikiTitle: "TVS Jupiter"
            },

            {
                name: "Toyota Camry", brand: "Toyota", model: "Camry", year: 2022,
                type: "Car", fuelType: "Hybrid", transmission: "Automatic", pricePerDay: 6500,
                location: "Delhi", seats: 5, description: "Premium hybrid sedan with great efficiency and comfort.",
                wikiTitle: "Toyota Camry"
            }
        ];

        const urlMap = {
            "Honda City 2022": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/2022_Honda_City_ZX_i-VTEC_%28India%29_front_view_%28cropped%29.jpg/960px-2022_Honda_City_ZX_i-VTEC_%28India%29_front_view_%28cropped%29.jpg",
            "Toyota Innova Crysta": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Toyota_Innova_Zenix_2.0_V_%28III%29_%E2%80%93_f_22032025.jpg/960px-Toyota_Innova_Zenix_2.0_V_%28III%29_%E2%80%93_f_22032025.jpg",
            "Hyundai Creta": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/2022_Hyundai_Creta_1.6_Plus_%28Chile%29_front_view.jpg/960px-2022_Hyundai_Creta_1.6_Plus_%28Chile%29_front_view.jpg",
            "Tata Nexon EV": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Tata_Nexon_Blue_Dual_Tone.jpg/960px-Tata_Nexon_Blue_Dual_Tone.jpg",
            "Mahindra Thar": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_02_%28cropped%29.jpg/960px-Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_02_%28cropped%29.jpg",
            "Maruti Suzuki Swift": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Suzuki_Swift_%282024%29_hybrid_DSC_6076.jpg/960px-Suzuki_Swift_%282024%29_hybrid_DSC_6076.jpg",
            "Royal Enfield Classic 350": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Royal_Enfield_Classic_350_%282017_Model_Year%29.jpg/960px-Royal_Enfield_Classic_350_%282017_Model_Year%29.jpg",
            "Honda Activa 6G": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Gold_Metallic_Honda_Activa.jpg/960px-Gold_Metallic_Honda_Activa.jpg",
            "Toyota Fortuner": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/2015_Toyota_Fortuner_%28New_Zealand%29.jpg/960px-2015_Toyota_Fortuner_%28New_Zealand%29.jpg",
            "Kia Seltos": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kia_Seltos_SP2_PE_Snow_White_Pearl_%2817%29_%28cropped%29.jpg/960px-Kia_Seltos_SP2_PE_Snow_White_Pearl_%2817%29_%28cropped%29.jpg",
            "Honda Amaze": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Honda_Amaze_%28front%29.png/960px-Honda_Amaze_%28front%29.png",
            "Renault Duster": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Dacia_Duster_TCe_130_Extreme_%28III%29_%E2%80%93_f_13102024.jpg/960px-Dacia_Duster_TCe_130_Extreme_%28III%29_%E2%80%93_f_13102024.jpg",
            "Volkswagen Polo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/VW_Polo_beats_%28VI%29_%E2%80%93_f_03032019.jpg/960px-VW_Polo_beats_%28VI%29_%E2%80%93_f_03032019.jpg",
            "BMW 3 Series": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/BMW_G20_%282022%29_IMG_7316_%282%29.jpg/960px-BMW_G20_%282022%29_IMG_7316_%282%29.jpg",
            "Yamaha R15 V4": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Yamaha_R15_V3.0.jpg/960px-Yamaha_R15_V3.0.jpg",
            "Suzuki Access 125": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Japan-Mobility-Show-2025-RuinDig_2481.jpg/960px-Japan-Mobility-Show-2025-RuinDig_2481.jpg",
            "Ather 450X": "https://images.unsplash.com/photo-1558981359-219d6364c9c8?q=80&w=600",
            "Mahindra XUV700": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/2021_Mahindra_XUV700_2.2_AX7_%28India%29_front_view.png/960px-2021_Mahindra_XUV700_2.2_AX7_%28India%29_front_view.png",
            "MG Hector": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600",
            "Skoda Slavia": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/2021_%C5%A0koda_Slavia_1.5_TSI_Style_%28India%29_front_view.png/960px-2021_%C5%A0koda_Slavia_1.5_TSI_Style_%28India%29_front_view.png",
        };

        // Load the 5 distinct images fetched from Wikimedia Commons
        const urls5 = JSON.parse(fs.readFileSync(path.join(__dirname, 'urls_5.json'), 'utf8'));

        const vehicles = [];
        for (const v of vehiclesData) {
            let imgs = urls5[v.name] || [];
            
            // If less than 5 images, pad with default image
            while (imgs.length < 5) {
                if (imgs.length > 0) {
                    imgs.push(imgs[0]);
                } else {
                    imgs.push("https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800");
                }
            }
            
            // Enforce max 5 images
            imgs = imgs.slice(0, 5);

            vehicles.push({
                ...v,
                image: imgs[0],
                images: imgs, // 5 distinct images
                owner: owner._id
            });
        }

        await Vehicle.insertMany(vehicles);
        console.log(`Successfully added ${vehicles.length} vehicles with authentic images.`);

        process.exit();
    } catch (error) {
        console.error("Seeding failed", error);
        process.exit(1);
    }
};

seedDatabase();
