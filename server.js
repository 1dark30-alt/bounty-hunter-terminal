const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8000;

// MIME types dictionary for static file serving
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
    // 1. Handle API Publish endpoint
    if (req.url === '/api/publish' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const dbData = JSON.parse(body);
                const dbPath = path.join(__dirname, 'database.json');
                
                // Write database.json
                fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
                console.log('[Server] Saved database.json');
                
                // Compile index_inline.html in-memory
                const htmlPath = path.join(__dirname, 'index.html');
                const cssPath = path.join(__dirname, 'style.css');
                const jsPath = path.join(__dirname, 'app.js');
                const outputPath = path.join(__dirname, 'index_inline.html');
                
                let html = fs.readFileSync(htmlPath, 'utf8');
                const css = fs.readFileSync(cssPath, 'utf8');
                const js = fs.readFileSync(jsPath, 'utf8');
                
                // Replace DEMO_PRESETS in JS content
                let finalJs = js;
                const presetsRegex = /const\s+DEMO_PRESETS\s*=\s*\{[\s\S]*?\};/i;
                finalJs = finalJs.replace(presetsRegex, `const DEMO_PRESETS = ${JSON.stringify(dbData)};`);
                
                // Inline CSS styles
                const cssLinkRegex = /<link\s+rel=["']stylesheet["']\s+href=["']style\.css["']\s*\/?>/i;
                html = html.replace(cssLinkRegex, `<style>\n${css}\n</style>`);
                
                // Inline JS script
                const jsScriptRegex = /<script\s+src=["']app\.js["']><\/script>/i;
                html = html.replace(jsScriptRegex, `<script>\n${finalJs}\n</script>`);
                
                // Write self-contained index_inline.html
                fs.writeFileSync(outputPath, html, 'utf8');
                console.log('[Server] Re-compiled and saved index_inline.html');
                
                // Git add, commit, and push
                console.log('[Server] Executing Git push sequence...');
                exec('git add . && (git diff-index --quiet HEAD || git commit -m "Auto-update database from Admin Terminal") && git push origin main', (err, stdout, stderr) => {
                    if (err) {
                        console.error('[Server] Git push failed:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: err.message }));
                        return;
                    }
                    console.log('[Server] Git push succeeded:', stdout);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'Changes successfully committed and pushed to GitHub!' }));
                });
                
            } catch (err) {
                console.error('[Server] Publish processing failed:', err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }
    
    // 2. Handle Static Files serving
    // Normalize path to prevent directory traversal
    let filePath = req.url === '/' ? '/index.html' : req.url;
    // Strip query parameters
    filePath = filePath.split('?')[0];
    const fullPath = path.join(__dirname, filePath);
    
    // Safety check: verify path is within workspace directory
    if (!fullPath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    fs.exists(fullPath, exists => {
        if (!exists) {
            res.writeHead(404);
            res.end('Not Found');
            return;
        }
        
        const ext = path.extname(fullPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(fullPath).pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`[Server] Bounty Hunter Local Server running at http://localhost:${PORT}/`);
});
