// controllers/zapier/token.js

const crypto = require("crypto");
const ZapierAuthIntegration = require("../../models/zapier/zapierAuthIntegration");

const clients = [
  {
    client_id: process.env.ZAPIER_CLIENT_ID,
    client_secret: process.env.ZAPIER_CLIENT_SECRET,
  },
];

const getClient = (clientId) =>
  clients.find((client) => client.client_id === clientId);

// secure random string generator
const generateToken = (size = 32) => crypto.randomBytes(size).toString("hex");

module.exports = {
  token: async function (req, res) {
    try {
      const { client_id, client_secret, grant_type, code, refresh_token } =
        req.body;

      const client = getClient(client_id);
      if (!client || client.client_secret !== client_secret) {
        return res.status(401).json({ error: "INVALID_CLIENT" });
      }

      if (grant_type === "authorization_code") {
        const integration = await ZapierAuthIntegration.findOne({
          code,
          status: "pending",
        });

        if (!integration) {
          return res.status(400).json({ error: "INVALID_GRANT" });
        }

        const accessToken = generateToken(24);
        const refreshToken = generateToken(24);

        integration.accessToken = accessToken;
        integration.refreshToken = refreshToken;
        integration.code = null;
        integration.status = "active";
        await integration.save();

        return res.status(200).json({
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: "Bearer",
          scope: integration.scope ? integration.scope.join(" ") : "",
        });
      }

      if (grant_type === "refresh_token") {
        const integration = await ZapierAuthIntegration.findOne({
          refreshToken: refresh_token,
          status: "active",
        });

        if (!integration) {
          return res.status(400).json({ error: "INVALID_GRANT" });
        }

        const newAccessToken = generateToken(24);
        integration.accessToken = newAccessToken;
        await integration.save();

        return res.status(200).json({
          access_token: newAccessToken,
          refresh_token,
          token_type: "Bearer",
        });
      }

      return res.status(400).json({ error: "UNSUPPORTED_GRANT_TYPE" });
    } catch (err) {
      console.error("Token error:", err);
      return res
        .status(500)
        .json({ error: "INTERNAL_SERVER_ERROR", details: err.message });
    }
  },
};
