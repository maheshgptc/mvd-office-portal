/**
 * RTO Survey & Monitoring Dashboard - Local Static & Proxy Server
 * 
 * Powered by Node.js built-in modules (http, fs, path, https, url).
 * Zero external npm dependencies required.
 * Provides:
 * 1. Fast static file delivery for the Single Page Dashboard
 * 2. Secure server-side proxy `/api/proxy-sheet` to eliminate Google Sheets CORS issues
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.csv': 'text/csv; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. Google Sheets Proxy API: /api/proxy-sheet?id=...&sheet=...
  if (pathname === '/api/proxy-sheet') {
    const sheetId = parsedUrl.query.id;
    const sheetTab = parsedUrl.query.sheet || '';
    const rawUrl = parsedUrl.query.url;

    let targetUrl = '';
    if (rawUrl) {
      targetUrl = rawUrl;
    } else if (sheetId) {
      targetUrl = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetId)}/gviz/tq?tqx=out:csv`;
      if (sheetTab) {
        targetUrl += `&sheet=${encodeURIComponent(sheetTab)}`;
      }
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing "id" or "url" parameter.' }));
      return;
    }

    const fetchRemote = (remoteUrl, redirectCount = 0) => {
      if (redirectCount > 5) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Too many redirects from Google Sheets.' }));
        return;
      }

      https.get(remoteUrl, (remoteRes) => {
        // Handle HTTP 301/302/307 redirects
        if (remoteRes.statusCode >= 300 && remoteRes.statusCode < 400 && remoteRes.headers.location) {
          fetchRemote(remoteRes.headers.location, redirectCount + 1);
          return;
        }

        if (remoteRes.statusCode !== 200) {
          res.writeHead(remoteRes.statusCode, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `Google Sheets responded with HTTP ${remoteRes.statusCode}` }));
          return;
        }

        res.writeHead(200, {
          'Content-Type': 'text/csv; charset=utf-8',
          'Cache-Control': 'no-store'
        });
        remoteRes.pipe(res);
      }).on('error', (err) => {
        console.error('Remote fetch error:', err);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to contact Google Sheets server: ' + err.message }));
      });
    };

    fetchRemote(targetUrl);
    return;
  }

  // 2. Health check endpoint: /api/health
  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }

  // 3. Static File Serving
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1><p>The requested file does not exist.</p>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`  RTO Executive Survey & Monitoring Dashboard Server Running`);
  console.log(`  Local URL:   http://localhost:${PORT}`);
  console.log(`  Proxy API:   http://localhost:${PORT}/api/proxy-sheet?id=YOUR_SHEET_ID`);
  console.log(`================================================================`);
});
