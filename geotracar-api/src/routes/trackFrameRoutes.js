const express = require('express');
const router  = express.Router();
const { createTrackFrame } = require('../controllers/trackFrameController');

// Recibe tramas en tiempo real y las guarda
router.post('/', createTrackFrame);

module.exports = router;
