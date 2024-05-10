import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Orders } from "./entity/Order";
import { OrderDetail } from "./entity/OrderDetail";
import { PriceHistory } from "./entity/PriceHistory";
import { Product } from "./entity/Product";

export const AppDataSource = new DataSource({
	type: "mysql",
	host: "localhost",
	port: 3306,
	username: "root",
	password: "",
	database: "SalesManagement",
	synchronize: false,
	logging: true,
	entities: [Orders, OrderDetail, PriceHistory, Product, User],
	migrations: [],
	subscribers: [],
});
