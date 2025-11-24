require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

// 👉 Import Mongo initializer
const initMongo = require("./config/db");

const app = express();
app.set("trust proxy", true);

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
   Server Running
  `);
});

// 👉 Connect to MongoDB first, then start server
(async () => {
  try {
    await initMongo();
    console.log("MongoDB initialized ✔");

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to initialize app:", err.message);
    process.exit(1);
  }
})();
