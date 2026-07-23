const fs = require('fs');

const vehiclesData = [
    { name: "Honda City 2022", search: "Honda City 2022" },
    { name: "Toyota Innova Crysta", search: "Toyota Innova Crysta" },
    { name: "Hyundai Creta", search: "Hyundai Creta" },
    { name: "Tata Nexon EV", search: "Tata Nexon" },
    { name: "Mahindra Thar", search: "Mahindra Thar" },
    { name: "Maruti Suzuki Swift", search: "Suzuki Swift" },
    { name: "Royal Enfield Classic 350", search: "Royal Enfield Classic 350" },
    { name: "Honda Activa 6G", search: "Honda Activa" },
    { name: "Toyota Fortuner", search: "Toyota Fortuner" },
    { name: "Kia Seltos", search: "Kia Seltos" },
    { name: "Honda Amaze", search: "Honda Amaze" },
    { name: "Renault Duster", search: "Renault Duster" },
    { name: "Volkswagen Polo", search: "Volkswagen Polo" },
    { name: "BMW 3 Series", search: "BMW 3 Series" },
    { name: "Yamaha R15 V4", search: "Yamaha YZF-R15" },
    { name: "Suzuki Access 125", search: "Suzuki Access 125" },
    { name: "Ather 450X", search: "Ather 450X" },
    { name: "Mahindra XUV700", search: "Mahindra XUV700" },
    { name: "MG Hector", search: "MG Hector" },
    { name: "Skoda Slavia", search: "Skoda Slavia" },
    { name: "Tata Harrier", search: "Tata Harrier" },
    { name: "Maruti Suzuki Baleno", search: "Suzuki Baleno" },
    { name: "Mercedes-Benz C-Class", search: "Mercedes-Benz C-Class" },
    { name: "KTM Duke 390", search: "KTM 390 Duke" },
    { name: "TVS Jupiter", search: "TVS Jupiter" },
    { name: "Bajaj Chetak", search: "Bajaj Chetak" },
    { name: "Toyota Camry", search: "Toyota Camry" }
];

async function run() {
    const urls = {};
    for (const v of vehiclesData) {
        let imgs = [];
        try {
            const response = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(v.search)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json`, {
                headers: { "User-Agent": "WheelShareSeeder/1.0 (allen@wheelshare.com)" }
            });
            const data = await response.json();
            if (data.query && data.query.pages) {
                for (const key of Object.keys(data.query.pages)) {
                    const page = data.query.pages[key];
                    if (page.imageinfo && page.imageinfo[0].thumburl) {
                        imgs.push(page.imageinfo[0].thumburl);
                    }
                }
            }
        } catch (e) {
            console.error(`Error for ${v.name}:`, e.message);
        }
        urls[v.name] = imgs;
        console.log(`Fetched ${v.name}: ${imgs.length} images`);
        await new Promise(r => setTimeout(r, 1000));
    }
    fs.writeFileSync("urls_5.json", JSON.stringify(urls, null, 2));
    console.log("Done!");
}
run();
