import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Order } from "./Order";
import { Cart } from "./Cart";
import { UserRole } from "../enums/UserRole";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column()
  surname!: string;

  @Column({ type: "varchar", nullable: true })
  address!: string | null;

  @Column({ type: "varchar", nullable: true })
  country!: string | null;

  @Column({ type: "varchar", nullable: true })
  city!: string | null;

  @Column({ type: "varchar", nullable: true })
  phone!: string | null;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role!: UserRole;

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts!: Cart[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
