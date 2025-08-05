const express = require("express");
const router = express.Router();
const { getSummary } = require("../controllers/adminSummaryController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.use(requireAuth);
router.use(requireAdmin);

router.get("/summary", getSummary);

module.exports = router;
