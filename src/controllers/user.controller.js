const ApiError = require('../ApiError')
const UserService = require('../services/user.service')
const jwt = require('jsonwebtoken')


exports.login = async (req, res, next) => {
    console.log(!req.body)
    if (!req.body?.username || !req.body?.password) {
        return next(new ApiError(400, 'Bad request'))
    }
    try {
        const userService = new UserService()
        const document = await userService.login(req.body)
        if (!document) {
            return next(new ApiError(403, 'Forbiden'))
        }
        const token = jwt.sign(JSON.stringify(document), process.env.SERECT_KEY)
        return res.send({ token: token, data: document })
    } catch (error) {
        console.log(error)
        return next(new ApiError(400, error.message))
    }
}

exports.create = async (req, res, next) => {
    console.log(req.body)
    if (!req.body?.userName) {
        return next(new ApiError(400, 'Bad request'))
    }

    try {
        const userService = new UserService()
        const result = await userService.create(req.body)
        return res.send({ data: result })
    } catch (error) {
        console.log(error)
        return next(new ApiError(400, error.message))
    }
}

exports.getSubordinates = async (req, res, next) => {
    if (!req?.body) {
        return next(new ApiError(400, 'Bad request'))
    }

    try {
        const userService = new UserService()
        const result = await userService.getSubordinates(req.body.userID)
        return res.send({ data: result })
    } catch (error) {
        console.log(error)
        return next(new ApiError(400, error.message))
    }
}

exports.getReferralOrManager = async (req, res, next) => {
    if (!req?.body) {
        return next(new ApiError(400, 'Bad request'))
    }

    try {
        const userService = new UserService()
        const result = await userService.getReferralOrManager(req.body.userID)
        return res.send({ data: result })
    } catch (error) {
        console.log(error)
        return next(new ApiError(400, error.message))
    }
}

exports.getReferredUsers = async (req, res, next) => {
    if (!req?.body) {
        return next(new ApiError(400, 'Bad request'))
    }

    try {
        const userService = new UserService()
        const result = await userService.getReferredUsers(req.body.userID)
        return res.send({ data: result })
    } catch (error) {
        console.log(error)
        return next(new ApiError(400, error.message))
    }
}
