const express = require('express');
const router = express.Router();
const orderDetailController = require('../controllers/orderDetailController');

router.get('/', orderDetailController.getAllOrderDetails);
router.post('/', orderDetailController.createOrderDetail);

module.exports = router;
