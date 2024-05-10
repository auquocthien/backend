const ApiError = require('../ApiError')
const OrderService = require('../services/order.service')

exports.create = async (req, res, next) => {
    if (!req.body?.products) {
        return next(new ApiError(400, 'Bad request'))
    }

    try {
        const orderService = new OrderService()
        const result = await orderService.create(req.body)
        return res.send({ data: result })
    } catch (error) {
        console.log(error)
        return next(new ApiError(500, error.message))
    }
}

exports.getOrderByUserId = async (req, res, next) => {
    if (!req.body?.userID) {
        return next(new ApiError(400, 'Bad request'))
    }

    try {
        const orderService = new OrderService()
        const result = await orderService.getOrderByUserId(req.body.userID)
        return res.send({ data: result })

    } catch (error) {
        console.log(error)
        return next(new ApiError(500, 'Internal Server'))
    }
}