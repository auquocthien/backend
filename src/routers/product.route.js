const express = require('express')
const productController = require('../controllers/product.controller')

const router = express.Router()

router.route('/').post(productController.create)
router.route('/update-price').patch(productController.updatePrice)

module.exports = router