// config/mongo.js
const mongoose = require("mongoose");

module.exports = async function initMongo() {
  const uri = process.env.DATABASE_URL;
  if (!uri) throw new Error("DATABASE_URL or MONGODB_URI is missing");

  try {
    await mongoose.connect(uri, {
      maxPoolSize: 50,
      minPoolSize: 5,
      waitQueueTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      autoIndex: process.env.NODE_ENV !== "production",
      family: 4,
      bufferCommands: false,
    });

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("🛑 MongoDB connection error:", error.message);
    process.exit(1);
  }
};
