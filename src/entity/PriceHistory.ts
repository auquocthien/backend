import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./Product";

@Entity()
export class PriceHistory {
	@PrimaryGeneratedColumn()
	PriceHistoryID: number;

	@ManyToOne(() => Product, (product) => product.PriceHistories)
	Product: Product;

	@Column({ type: "decimal", precision: 10, scale: 2 })
	Price: number; // Giá của sản phẩm

	@Column({ type: "int" })
	Quantity: number;

	@Column({ type: "date" })
	StartDate: Date;

	@Column({ type: "date" })
	EndDate: Date;

	@Column({ type: "enum", enum: ["purchase", "sale"] }) // New property
	Type: "purchase" | "sale";
}
