const express = require('express');
const router = express.Router();
const trackerController = require('../controllers/trackerController');

router.get('/', trackerController.getAllTrackers);
router.post('/', trackerController.createTracker);

module.exports = router;
