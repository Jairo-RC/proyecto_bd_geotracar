const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const { upgradeToPremium } = require("../controllers/upgradeController");

// POST /api/clients/upgrade
router.post("/clients/upgrade", requireAuth, upgradeToPremium);

module.exports = router;
