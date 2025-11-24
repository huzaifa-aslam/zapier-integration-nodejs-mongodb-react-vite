// controllers/zapier/approve.js
const crypto = require("crypto");
const ZapierAuthIntegration = require("../../modals/ZapierAuthIntegration");
const User = require("../../modals/user");

module.exports = {
  approve: async function (req, res) {
    try {
      const query = req.body;

      // 🔎 Extract email
      const email = req.body.email;
      if (!email) {
        return res.status(400).json({
          message: "Email is required",
          status: 400,
          error: true,
          data: {},
        });
      }

      // 🔎 Lookup user
      const user = await User.findOne({ email: email.toLowerCase().trim() });

      if (!user) {
        return res.status(400).json({
          message: "User not found",
          status: 400,
          error: true,
          data: {},
        });
      }

      // 🔐 If user approves
      if (req.body.approve) {
        const code = crypto.randomBytes(16).toString("hex");

        await ZapierAuthIntegration.findOneAndUpdate(
          { email: user.email },
          {
            email: user.email,
            code,
            status: "pending",
          },
          { upsert: true, new: true },
        );

        // ✅ Success response (keep original format)
        return res.json({
          redirect_uri: query.redirect_uri,
          code,
          state: query.state,
        });
      }

      // ❌ User denied access
      return res.status(400).json({
        message: "Access denied",
        status: 400,
        error: true,
        data: {
          redirect_uri: query.redirect_uri,
        },
      });
    } catch (err) {
      console.error("Approve error:", err);

      return res.status(500).json({
        message: "Internal server error",
        status: 500,
        error: true,
        data: { details: err.message },
      });
    }
  },
};
