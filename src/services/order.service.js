const { AppDataSource } = require('../data-source')
const { Orders } = require('../entity/Order')
const { OrderDetail } = require('../entity/OrderDetail')
const { Product } = require('../entity/Product')
const { User } = require('../entity/User')
const ProductService = require('../services/product.service')
const UserService = require('./user.service')

class OrderService {
    constructor() {
        this.Orders = AppDataSource.getRepository(Orders)
        this.OrderDetail = AppDataSource.getRepository(OrderDetail)
        this.Product = AppDataSource.getRepository(Product)
        this.User = AppDataSource.getRepository(User)

        this.productService = new ProductService()
        this.userService = new UserService()
    }


    async create(payload) {
        try {
            let seller
            if (payload.sellerID) {
                seller = await this.User.findOneBy({ UserID: payload.sellerID })
            }

            const newOrder = new Orders()
            newOrder.OrderDate = new Date().toISOString().slice(0, 10)
            newOrder.Seller = seller

            const orderSaved = await this.Orders.save(newOrder)

            const { products } = payload
            var totalAmout = 0.00
            for (const product of products) {
                const exitProduct = await this.Product.findOneBy({ ProductID: product.productID })
                const newOrderDetail = new OrderDetail()

                newOrderDetail.Product = exitProduct.ProductID
                newOrderDetail.Orders = orderSaved
                newOrderDetail.Quantity = product.quantity
                newOrderDetail.UnitPrice = exitProduct.CurrentPrice
                totalAmout = totalAmout + (newOrderDetail.UnitPrice * newOrderDetail.Quantity)
                await this.OrderDetail.save(newOrderDetail)

                exitProduct.Quantity = exitProduct.Quantity - newOrderDetail.Quantity
                await this.Product.save(exitProduct)

                await this.productService.increaseProductSold(product)

            }

            orderSaved.TotalAmount = totalAmout
            await this.userService.updateRevenue(seller.UserID, totalAmout)
            return await this.Orders.save(orderSaved)

        } catch (error) {
            console.log(error)
        }
    }

    async getOrderByUserId(userID) {
        try {
            const orders = await this.Orders.find({
                relations: ['OrderDetails'],
                where: { Seller: { UserID: userID } }
            })

            return orders
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = OrderService
