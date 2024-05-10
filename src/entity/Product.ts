import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PriceHistory } from "./PriceHistory";
import { OrderDetail } from "./OrderDetail";

@Entity()
export class Product {
	@PrimaryGeneratedColumn()
	ProductID: number;

	@Column({ length: 100 })
	ProductName: string;

	@Column("text", { nullable: true })
	Description: string;

	@Column({ type: "int"})
	Quantity: number;

	@Column({ type: "decimal", precision: 10, scale: 2 })
	CurrentPrice: number;

	@OneToMany(() => PriceHistory, (priceHistory) => priceHistory.Product)
	PriceHistories: PriceHistory[];

	@OneToMany(() => OrderDetail, (orderDetail) => orderDetail.Product)
	OrderDetails: OrderDetail[];
}
