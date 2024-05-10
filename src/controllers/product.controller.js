const ApiError = require('../ApiError')
const ProductService = require('../services/product.service')

exports.create = async (req, res, next) => {
    try {
        if (!req.body.name) {
            return next(new ApiError(400, 'Bad request'))
        }

        const productService = new ProductService()
        const document = await productService.create(req.body)

        return res.send({ data: document })
    } catch (error) {
        console.log(error)
        return next(new ApiError(400, 'Bad request'))
    }

}

exports.updatePrice = async (req, res, next) => {
    if (!req.body?.price || !req.body?.id) {
        return next(new ApiError(400, 'Bad request'))
    }
    try {
        const productService = new ProductService()
        const document = await productService.updatePrice(req.body)

        return res.send({ data: document })

    } catch (error) {
        console.log(error)
        return next(new ApiError(400, 'Bad request'))
    }
}