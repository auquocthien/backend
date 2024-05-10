const express = require('express')
const orderController = require('../controllers/order.controller')

const router = express.Router()

router.route('/').post(orderController.create)
router.route('/orders').post(orderController.getOrderByUserId)

module.exports = router