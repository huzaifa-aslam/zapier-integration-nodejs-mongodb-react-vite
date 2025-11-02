// controllers/zapier/approve.js
const crypto = require("crypto");
const ZapierAuthIntegration = require("../../models/zapier/zapierAuthIntegration");
const User = require("../../models/user");

module.exports = {
  approve: async function (req, res) {
    try {
      // ✅ Fetch the user from DB
      const user = await User.findById(req._id);
      if (!user) {
        return res.status(400).json({ error: "USER_NOT_FOUND" });
      }

      const query = req.body;

      // ✅ If user approved Zapier connection
      if (req.body.approve) {
        const code = crypto.randomBytes(16).toString("hex");

        // ✅ Create or update ZapierAuthIntegration by email
        await ZapierAuthIntegration.findOneAndUpdate(
          { email: user.email },
          {
            email: user.email,
            code,
            status: "pending",
          },
          { upsert: true, new: true },
        );

        // ✅ Return success response
        return res.json({
          redirect_uri: query.redirect_uri,
          code,
          state: query.state,
        });
      } else {
        // ❌ If user denied access
        return res.status(400).json({
          error: "ACCESS_DENIED",
          redirect_uri: query.redirect_uri,
        });
      }
    } catch (err) {
      console.error("Approve error:", err);
      return res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
        details: err.message,
      });
    }
  },
};
