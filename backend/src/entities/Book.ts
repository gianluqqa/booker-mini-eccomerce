import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { OrderItem } from "./OrderItem";
import { Cart } from "./Cart";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  title!: string;

  @Column()
  author!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column()
  stock!: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.book)
  orderItems!: OrderItem[];

  @OneToMany(() => Cart, (cart) => cart.book)
  carts!: Cart[];
}
