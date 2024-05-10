import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
} from "typeorm";
import { User } from "./User";
import { OrderDetail } from "./OrderDetail";

@Entity()
export class Orders {
	@PrimaryGeneratedColumn()
	OrderID: number;

	@ManyToOne(() => User, (user) => user.Sales)
	Seller: User;

	@Column({ type: "date" })
	OrderDate: Date;

	@Column({ type: "decimal", precision: 10, scale: 2 })
	TotalAmount: number;

	@OneToMany(() => OrderDetail, (orderDetail) => orderDetail.Orders)
	OrderDetails: OrderDetail[];
}
