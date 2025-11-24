// routes/zapier/index.js

const express = require("express");
const router = express.Router();
const authorizeController = require("../../controllers/zapier/authorize");
const approveController = require("../../controllers/zapier/approve");
const tokenController = require("../../controllers/zapier/token");
const me = require("../../controllers/zapier/me");

router.get("/authorize", authorizeController.authorize);
router.post("/approve", approveController.approve);
router.post("/token", tokenController.token);
router.get("/me", me.getAccessToken, me.requireAccessToken, me.userInfo);

module.exports = router;
