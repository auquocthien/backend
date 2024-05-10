import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { Orders } from "./Order";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	UserID: number;

	@Column({ length: 50, unique: true })
	Username: string;

	@Column({ length: 100 })
	Password: string;

	@Column({ length: 100 })
	FullName: string;

	@Column({ length: 50 })
	Role: string;

	@Column({ nullable: true })
	ManagerID: number;

	@Column({ nullable: true })
	ReferencesID: number;

	@Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
	SubRevenue: number;

	@Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
	PerRevenue: number;

	@OneToMany(() => Orders, (order) => order.Seller)
	Sales: Orders[];

	@OneToMany(() => User, (user) => user.manager)
	subordinates: User[];

	@ManyToOne(() => User, (user) => user.subordinates)
	@JoinColumn({ name: "ManagerID" }) // Chỉ định cột liên kết
	manager: User;
}
