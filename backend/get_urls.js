const fs = require('fs');

const vehiclesData = [
    { name: "Honda City 2022", wikiTitle: "Honda City" },
    { name: "Toyota Innova Crysta", wikiTitle: "Toyota Innova" },
    { name: "Hyundai Creta", wikiTitle: "Hyundai Creta" },
    { name: "Tata Nexon EV", wikiTitle: "Tata Nexon" },
    { name: "Mahindra Thar", wikiTitle: "Mahindra Thar" },
    { name: "Maruti Suzuki Swift", wikiTitle: "Suzuki Swift" },
    { name: "Royal Enfield Classic 350", wikiTitle: "Royal Enfield Classic" },
    { name: "Honda Activa 6G", wikiTitle: "Honda Activa" },
    { name: "Toyota Fortuner", wikiTitle: "Toyota Fortuner" },
    { name: "Kia Seltos", wikiTitle: "Kia Seltos" },
    { name: "Honda Amaze", wikiTitle: "Honda Amaze" },
    { name: "Renault Duster", wikiTitle: "Dacia Duster" },
    { name: "Volkswagen Polo", wikiTitle: "Volkswagen Polo" },
    { name: "BMW 3 Series", wikiTitle: "BMW 3 Series" },
    { name: "Yamaha R15 V4", wikiTitle: "Yamaha YZF-R15" },
    { name: "Suzuki Access 125", wikiTitle: "Suzuki Access 125" },
    { name: "Ather 450X", wikiTitle: "Ather Energy" },
    { name: "Mahindra XUV700", wikiTitle: "Mahindra XUV700" },
    { name: "MG Hector", wikiTitle: "MG Hector" },
    { name: "Skoda Slavia", wikiTitle: "Škoda Slavia" },
    { name: "Tata Harrier", wikiTitle: "Tata Harrier" },
    { name: "Maruti Suzuki Baleno", wikiTitle: "Suzuki Baleno (2015)" },
    { name: "Mercedes-Benz C-Class", wikiTitle: "Mercedes-Benz C-Class" },
    { name: "KTM Duke 390", wikiTitle: "KTM 390 Duke" },
    { name: "TVS Jupiter", wikiTitle: "TVS Jupiter" },
    { name: "Bajaj Chetak", wikiTitle: "Bajaj Chetak" },
    { name: "Toyota Camry", wikiTitle: "Toyota Camry" }
];

async function run() {
    const urls = {};
    for (const v of vehiclesData) {
        let imageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
        try {
            const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(v.wikiTitle)}&prop=pageimages&format=json&pithumbsize=600`, {
                headers: { "User-Agent": "WheelShareSeeder/1.0 (allen@wheelshare.com)" }
            });
            const data = await response.json();
            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];
            if (pageId !== "-1" && pages[pageId].thumbnail) {
                imageUrl = pages[pageId].thumbnail.source;
            }
        } catch (e) {
            console.error(`Error for ${v.name}:`, e.message);
        }
        urls[v.name] = imageUrl;
        console.log(`Fetched ${v.name}`);
        await new Promise(r => setTimeout(r, 1000));
    }
    fs.writeFileSync("urls.json", JSON.stringify(urls, null, 2));
    console.log("Done!");
}
run();
