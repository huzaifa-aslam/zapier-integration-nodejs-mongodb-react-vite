// controllers/zapier/me.js

const ZapierAuthIntegration = require("../../modals/ZapierAuthIntegration");
const User = require("../../modals/user");

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
        return res.status(401).json({
          message: "Access token is missing",
          status: 401,
          error: true,
          data: {},
        });
      }

      // ✅ Find integration by accessToken + active status
      const tokenDoc = await ZapierAuthIntegration.findOne({
        accessToken: inToken,
        status: "active",
      });

      if (!tokenDoc) {
        return res.status(401).json({
          message: "Invalid access token",
          status: 401,
          error: true,
          data: {},
        });
      }

      req.integration = tokenDoc;
      next();
    } catch (err) {
      console.error("getAccessToken error:", err);
      return res.status(500).json({
        message: "Internal server error",
        status: 500,
        error: true,
        data: { details: err.message },
      });
    }
  },

  // ✅ Middleware to ensure token is present
  requireAccessToken: function (req, res, next) {
    if (req.integration) return next();
    return res.status(401).json({
      message: "Access token is missing",
      status: 401,
      error: true,
      data: {},
    });
  },

  // ✅ Return connected user info
  userInfo: async function (req, res) {
    try {
      if (!req.integration || !req.integration.email) {
        return res.status(404).json({
          message: "User not found",
          status: 404,
          error: true,
          data: {},
        });
      }

      const user = await User.findOne({ email: req.integration.email });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          status: 404,
          error: true,
          data: {},
        });
      }

      // ✅ Success response (keep original format)
      const out = {
        _id: user._id.toString(),
        email: user.email,
        email_verified: true,
        connected: true,
      };

      return res.status(200).json(out);
    } catch (err) {
      console.error("userInfo error:", err);
      return res.status(500).json({
        message: "Internal server error",
        status: 500,
        error: true,
        data: { details: err.message },
      });
    }
  },
};
