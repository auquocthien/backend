const userRoute = require('./user.route')
const productRoute = require('./product.route')
const orderRoute = require('./order.route')

function route(app) {
    app.use('/api/user', userRoute)
    app.use('/api/product', productRoute)
    app.use('/api/order', orderRoute)
}

module.exports = route