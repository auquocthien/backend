const express = require('express')
const userController = require('../controllers/user.controller')

const router = express.Router()

router.route('/').post(userController.create)
router.route('/login').post(userController.login)
router.route('/get-subordinates').post(userController.getSubordinates)
router.route('/get-referralOrManager').post(userController.getReferralOrManager)
router.route('/get-referredUsers').post(userController.getReferredUsers)

module.exports = router