const fs = require('fs');
const path = require('path');
const https = require('https');

const outDir = path.join(__dirname, 'design-tokens');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

// 1. Read projects output
const projectsOutput = fs.readFileSync('C:\\Users\\allen\\.gemini\\antigravity-ide\\brain\\5a047439-041f-4e05-829f-f2e19212fca9\\.system_generated\\steps\\513\\output.txt', 'utf8');
const projectsData = JSON.parse(projectsOutput);
const wheelshareProject = projectsData.projects.find(p => p.name.includes('1339007636559193517'));

if (wheelshareProject) {
    fs.writeFileSync(path.join(outDir, 'design-theme.json'), JSON.stringify(wheelshareProject.designTheme, null, 2));
    if (wheelshareProject.designTheme && wheelshareProject.designTheme.designMd) {
        fs.writeFileSync(path.join(outDir, 'design.md'), wheelshareProject.designTheme.designMd);
    }
}

// 2. Read screens output
const screensOutput = fs.readFileSync('C:\\Users\\allen\\.gemini\\antigravity-ide\\brain\\5a047439-041f-4e05-829f-f2e19212fca9\\.system_generated\\steps\\530\\output.txt', 'utf8');
const screensData = JSON.parse(screensOutput);

const screensDir = path.join(outDir, 'screens');
if (!fs.existsSync(screensDir)) {
    fs.mkdirSync(screensDir);
}

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function downloadScreens() {
    for (const screen of screensData.screens) {
        if (screen.htmlCode && screen.htmlCode.downloadUrl) {
            let title = screen.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const dest = path.join(screensDir, `${title}.html`);
            console.log(`Downloading ${title}...`);
            await download(screen.htmlCode.downloadUrl, dest);
        }
    }
    console.log("Done!");
}

downloadScreens();
