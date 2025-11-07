import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { OrderItem } from "./OrderItem";
import { Cart } from "./Cart";

@Entity()
export class Book {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  image?: string;

  @Column()
  author!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column()
  stock!: number;

  @Column()
  genre!: string;

  @Column({ nullable: true })
  intro?: string;

  @Column()
  description!: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.book)
  orderItems!: OrderItem[];

  @OneToMany(() => Cart, (cart) => cart.book)
  carts!: Cart[];
}
