const fs = require('fs');

async function test() {
    const title = "Toyota Innova";
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=images&format=json`);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}
test();
