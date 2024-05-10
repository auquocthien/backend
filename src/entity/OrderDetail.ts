import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Orders } from "./Order";
import { Product } from "./Product";

@Entity()
export class OrderDetail {
	@PrimaryGeneratedColumn()
	OrderDetailID: number;

	@ManyToOne(() => Orders, (order) => order.OrderDetails)
	Orders: Orders;

	@ManyToOne(() => Product, (product) => product.ProductID)
	Product: Product;

	@Column({ type: "int" })
	Quantity: number;

	@Column({ type: "decimal", precision: 10, scale: 2 })
	UnitPrice: number;
}
