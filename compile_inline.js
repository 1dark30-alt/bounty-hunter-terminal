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
        html = html.replace(jsScriptRegex, `<script>\n${js}\n</script>`);
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
