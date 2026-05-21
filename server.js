const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8082;
const DIST = path.join(__dirname, "dist");
const SRC = __dirname;

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".ts": "application/x-typescript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

const CSP = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "script-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self'",
].join("; ");

http
  .createServer((req, res) => {
    if (req.url === "/favicon.ico") {
      res.writeHead(204);
      res.end();
      return;
    }

    // Try dist/ first (production build), fall back to root (dev direct open)
    let filePath = path.join(DIST, req.url === "/" ? "index.html" : req.url);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(SRC, req.url === "/" ? "index.html" : req.url);
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Content-Security-Policy": CSP,
    });
    fs.createReadStream(filePath).pipe(res);
  })
  .listen(PORT, () => {
    console.log(`UI Architecture Demo → http://localhost:${PORT}`);
    console.log(`  Dev mode:  npm run dev`);
    console.log(`  Build:     npm run build`);
    console.log(`  Serve:     npm run serve`);
  });