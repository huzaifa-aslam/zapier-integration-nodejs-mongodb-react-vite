// controllers/zapier/me.js

const ZapierAuthIntegration = require("../../models/zapier/zapierAuthIntegration");
const User = require("../../models/user");

module.exports = {
  // ✅ Middleware to verify access token
  getAccessToken: async function (req, res, next) {
    try {
      const auth = req.headers["authorization"];
      let inToken = null;

      if (auth && auth.toLowerCase().startsWith("bearer ")) {
        inToken = auth.slice("bearer ".length).trim();
      } else if (req.body?.access_token) {
        inToken = req.body.access_token;
      } else if (req.query?.access_token) {
        inToken = req.query.access_token;
      }

      if (!inToken) {
        return res.status(401).json({ error: "MISSING_TOKEN" });
      }

      // ✅ Find integration by accessToken + active status
      const tokenDoc = await ZapierAuthIntegration.findOne({
        accessToken: inToken,
        status: "active",
      });

      if (!tokenDoc) {
        return res.status(401).json({ error: "INVALID_TOKEN" });
      }

      req.integration = tokenDoc;
      next();
    } catch (err) {
      console.error("getAccessToken error:", err);
      return res
        .status(500)
        .json({ error: "INTERNAL_SERVER_ERROR", details: err.message });
    }
  },

  // ✅ Middleware to ensure token is present
  requireAccessToken: function (req, res, next) {
    if (req.integration) return next();
    return res.status(401).json({ error: "MISSING_TOKEN" });
  },

  // ✅ Return connected user info
  userInfo: async function (req, res) {
    try {
      if (!req.integration || !req.integration.email) {
        return res.status(404).json({ error: "USER_NOT_FOUND" });
      }

      const user = await User.findOne({ email: req.integration.email });
      if (!user) {
        return res.status(404).json({ error: "USER_NOT_FOUND" });
      }

      const out = {
        _id: user._id.toString(),
        email: user.email,
        email_verified: true,
        connected: true,
      };

      return res.status(200).json(out);
    } catch (err) {
      console.error("userInfo error:", err);
      return res
        .status(500)
        .json({ error: "INTERNAL_SERVER_ERROR", details: err.message });
    }
  },
};
