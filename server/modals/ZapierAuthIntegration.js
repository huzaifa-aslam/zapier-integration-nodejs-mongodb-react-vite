// modals/ZapierAuthIntegration.js


const mongoose = require("mongoose");

const ZapierAuthIntegrationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, ref: "User" },
    code: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    expiresAt: { type: Date },
    status: {
      type: String,
      enum: ["active", "revoked", "expired", "pending"],
      default: "active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "ZapierAuthIntegration",
  ZapierAuthIntegrationSchema,
);
