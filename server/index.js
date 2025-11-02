require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.set("trust proxy", true); // for Cloudflare or reverse proxies

// Middleware
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cors());

// Simple request logger
app.use((req, _res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.ip}`,
  );
  next();
});

// Routes
app.use("/api/zapier", require("./routes/zapier"));

// Root route
app.get("/", (_req, res) => {
  res.status(200).send(`
    <html><head><title>Server Status</title></head>
    <body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;">
      <div>
        <h1>🚀 Server Running</h1>
        <p>Status: <strong>Online</strong></p>
      </div>
    </body></html>
  `);
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
