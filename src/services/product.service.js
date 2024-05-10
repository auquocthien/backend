const { AppDataSource } = require('../data-source')
const { Product } = require('../entity/Product')
const { PriceHistory } = require('../entity/PriceHistory')
const { Not } = require('typeorm')
class ProductService {
    constructor() {
        this.Product = AppDataSource.getRepository(Product)
        this.PriceHistory = AppDataSource.getRepository(PriceHistory)
    }

    async create(payload) {
        try {
            const existingProduct = await this.Product.findOneBy({
                ProductName: payload.name,
            });

            if (!existingProduct) {
                const newProduct = new Product();
                newProduct.ProductName = payload.name;
                newProduct.CurrentPrice = payload.price;
                newProduct.Description = payload.desc;
                newProduct.Quantity = payload.quantity;

                const savedProduct = await this.Product.save(newProduct);

                const newPriceHistory = new PriceHistory();
                newPriceHistory.Product = savedProduct; // Use savedProduct for consistency
                newPriceHistory.StartDate = new Date().toISOString().slice(0, 10);
                newPriceHistory.Price = savedProduct.CurrentPrice;
                newPriceHistory.Quantity = savedProduct.Quantity;

                await this.PriceHistory.save(newPriceHistory);

                return savedProduct; // Return saved product for clarity
            }

            return existingProduct; // Return existing product if found
        } catch (error) {
            console.error(error);
            throw error; // Re-throw the error to allow proper handling
        }
    }

    async updatePrice(payload) {
        try {
            const product = await this.Product.findOneBy({ ProductID: payload.id });

            if (!product) {
                throw new Error('Product not found');
            }

            const existingHistory = await this.PriceHistory.findOne({
                where: {
                    Product: product.ProductID,
                    StartDate: new Date().toISOString().slice(0, 10),
                    EndDate: Not('0000-00-00')
                }
            });

            if (existingHistory) {
                console.log('exit history')
                existingHistory.Price = payload.price;
                await this.PriceHistory.save(existingHistory);
            }
            else {

                const historyExitButNotEndDate = await this.PriceHistory.findOneBy({
                    Product: product.ProductID,
                    EndDate: '0000-00-00',
                    Type: 'sale'
                })

                historyExitButNotEndDate.EndDate = payload?.startDate || new Date().toISOString().slice(0, 10)
                await this.PriceHistory.save(historyExitButNotEndDate)

                const newPriceHistory = new PriceHistory();
                newPriceHistory.Product = product;
                newPriceHistory.StartDate = payload?.startDate || new Date().toISOString().slice(0, 10);
                newPriceHistory.EndDate = payload.endDate;
                newPriceHistory.Price = payload.price;
                newPriceHistory.Type = 'sale'

                await this.PriceHistory.save(newPriceHistory);
            }

            return product;
        } catch (error) {
            console.error(error);
            throw error; // Re-throw for proper handling
        }
    }

    async increaseProductSold(payload) {
        try {

            const existingHistory = await this.PriceHistory.findOneBy({
                StartDate: new Date().toISOString().slice(0, 10),
                Type: Not('purchase'),
                Product: { ProductID: payload.productID }
            });
            console.log(existingHistory)

            if (existingHistory) {
                console.log('existing history')
                existingHistory.Quantity = existingHistory.Quantity + payload.quantity
                return await this.PriceHistory.save(existingHistory)
            }
            else {
                console.log('new history')
                const product = await this.Product.findOneBy({ ProductID: payload.productID })
                product.Quantity = product.Quantity - payload.quantity
                await this.Product.save(product)

                const newProductHistory = new PriceHistory()
                newProductHistory.Price = product.CurrentPrice
                newProductHistory.StartDate = new Date().toISOString().slice(0, 10)
                newProductHistory.Quantity = payload.quantity
                newProductHistory.Product = product
                newProductHistory.Type = 'sale'

                return await this.PriceHistory.save(newProductHistory)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ProductService