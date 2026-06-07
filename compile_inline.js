const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const cssPath = path.join(__dirname, 'style.css');
const jsPath = path.join(__dirname, 'app.js');
const outputPath = path.join(__dirname, 'index_inline.html');

try {
    console.log('Reading source files...');
    let html = fs.readFileSync(htmlPath, 'utf8');
    const css = fs.readFileSync(cssPath, 'utf8');
    const js = fs.readFileSync(jsPath, 'utf8');

    // Check if database.json exists and inline it
    let finalJs = js;
    const dbPath = path.join(__dirname, 'database.json');
    if (fs.existsSync(dbPath)) {
        try {
            const dbContent = fs.readFileSync(dbPath, 'utf8');
            // Validate it's valid JSON
            JSON.parse(dbContent); 
            console.log('database.json found and validated.');
            
            // Replace DEMO_PRESETS in JS
            const presetsRegex = /const\s+DEMO_PRESETS\s*=\s*\{[\s\S]*?\};/i;
            if (presetsRegex.test(finalJs)) {
                finalJs = finalJs.replace(presetsRegex, `const DEMO_PRESETS = ${dbContent.trim()};`);
                console.log('Successfully inlined database.json as DEMO_PRESETS.');
            } else {
                console.warn('Warning: Could not find const DEMO_PRESETS declaration in app.js');
            }
        } catch (e) {
            console.error('Error reading/parsing database.json. Keeping default presets. Error:', e.message);
        }
    } else {
        console.log('database.json not found. Using default app.js demo presets.');
    }

    // Replace CSS link
    const cssLinkRegex = /<link\s+rel=["']stylesheet["']\s+href=["']style\.css["']\s*\/?>/i;
    if (cssLinkRegex.test(html)) {
        html = html.replace(cssLinkRegex, `<style>\n${css}\n</style>`);
        console.log('Inlined style.css successfully.');
    } else {
        console.warn('Warning: Could not find style.css link tag in index.html');
    }

    // Replace JS script
    const jsScriptRegex = /<script\s+src=["']app\.js["']><\/script>/i;
    if (jsScriptRegex.test(html)) {
        html = html.replace(jsScriptRegex, `<script>\n${finalJs}\n</script>`);
        console.log('Inlined app.js successfully.');
    } else {
        console.warn('Warning: Could not find app.js script tag in index.html');
    }

    fs.writeFileSync(outputPath, html, 'utf8');
    console.log('Successfully generated self-contained file: index_inline.html');
} catch (err) {
    console.error('Error during compilation:', err);
    process.exit(1);
}
