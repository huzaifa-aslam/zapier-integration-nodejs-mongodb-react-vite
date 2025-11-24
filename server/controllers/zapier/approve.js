// controllers/zapier/approve.js
const crypto = require("crypto");
const ZapierAuthIntegration = require("../../modals/ZapierAuthIntegration");
const User = require("../../modals/user");

module.exports = {
  approve: async function (req, res) {
    try {
      const query = req.body;
      // 🔎 Extract email from request
      const email = req.body.email;
      if (!email) {
        return res.status(400).json({
          message: "Email is required",
          success: false,
          error: true,
          data: {},
        });
      }

      // ✅ Fetch user by email
      const user = await User.findOne({ email: email.toLowerCase().trim() });

      if (!user) {
        return res.status(400).json({ error: "USER_NOT_FOUND" });
      }

      // ✅ If user approved Zapier connection
      if (req.body.approve) {
        const code = crypto.randomBytes(16).toString("hex");

        // Create or update ZapierAuthIntegration
        await ZapierAuthIntegration.findOneAndUpdate(
          { email: user.email },
          {
            email: user.email,
            code,
            status: "pending",
          },
          { upsert: true, new: true },
        );

        return res.json({
          redirect_uri: query.redirect_uri,
          code,
          state: query.state,
        });
      }

      // ❌ If user denied access
      return res.status(400).json({
        error: "ACCESS_DENIED",
        redirect_uri: query.redirect_uri,
      });
    } catch (err) {
      console.error("Approve error:", err);
      return res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
        details: err.message,
      });
    }
  },
};
