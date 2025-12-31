/**
 * CraftRise Ban Checker - Proxy Server
 * 
 * Bu sunucu, tarayıcıdan gelen istekleri CraftRise sunucularına yönlendirir.
 * CORS kısıtlamalarını aşmak için gereklidir.
 * 
 * Kullanım:
 *   1. npm install express cors node-fetch
 *   2. node server.js
 *   3. Tarayıcıda index.html'i açın
 */

const express = require('express');
const cors = require('cors');
const https = require('https');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Utility functions
function generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateFakeCookie() {
    const phpsessid = generateRandomString(26);
    const cf = generateRandomString(32);
    return `PHPSESSID=${phpsessid}; cf_clearance=${cf};`;
}

// Check endpoint
app.post('/check', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    console.log(`[${new Date().toLocaleTimeString('tr-TR')}] Checking: ${username}`);

    const postData = `username=${encodeURIComponent(username)}`;

    const options = {
        hostname: 'www.craftrise.com.tr',
        port: 443,
        path: '/posts/post-search.php',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Content-Length': Buffer.byteLength(postData),
            'Accept': '*/*',
            'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': 'https://www.craftrise.com.tr/urun/739RC',
            'Cookie': generateFakeCookie(),
            'Origin': 'https://www.craftrise.com.tr'
        }
    };

    try {
        const result = await new Promise((resolve, reject) => {
            const request = https.request(options, (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    console.log(`  Response (${data.length} bytes): ${data.substring(0, 100)}...`);

                    // Check for maintenance mode
                    if ((data.includes('window.location') && data.includes('maintenance.html')) ||
                        data.includes('Permission')) {
                        resolve({ banned: false, maintenance: true, raw: data });
                        return;
                    }

                    // Check for banned status
                    const isBanned = data.includes('"resultID":-1') &&
                        data.includes('Oyuncu engellenmiş olduğu için aranamıyor');

                    resolve({ banned: isBanned, maintenance: false, raw: data });
                });
            });

            request.on('error', (error) => {
                console.error(`  Error: ${error.message}`);
                reject(error);
            });

            request.setTimeout(30000, () => {
                request.destroy();
                reject(new Error('Request timeout'));
            });

            request.write(postData);
            request.end();
        });

        const status = result.maintenance ? 'MAINTENANCE' : (result.banned ? 'BANNED' : 'CLEAN');
        console.log(`  Result: ${status}`);

        res.json({
            username,
            banned: result.banned,
            maintenance: result.maintenance
        });

    } catch (error) {
        console.error(`  Error checking ${username}: ${error.message}`);
        res.status(500).json({
            error: error.message,
            username,
            banned: false,
            maintenance: false
        });
    }
});

// Batch check endpoint (for future use)
app.post('/check-batch', async (req, res) => {
    const { usernames } = req.body;

    if (!Array.isArray(usernames) || usernames.length === 0) {
        return res.status(400).json({ error: 'Usernames array is required' });
    }

    console.log(`[${new Date().toLocaleTimeString('tr-TR')}] Batch check: ${usernames.length} accounts`);

    res.json({
        message: 'Batch check endpoint - use /check for individual checks',
        count: usernames.length
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                                                              ║');
    console.log('║           🔥 CraftRise Ban Checker Proxy Server 🔥           ║');
    console.log('║                                                              ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║                                                              ║');
    console.log(`║   📡 Server running at: http://localhost:${PORT}               ║`);
    console.log('║   🌐 Open index.html in your browser                         ║');
    console.log('║                                                              ║');
    console.log('║   Credits:                                                   ║');
    console.log('║     👨‍💻 yanaksalvo                                            ║');
    console.log('║                                                              ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
});
