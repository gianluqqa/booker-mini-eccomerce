import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Book } from "./Book";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne("Order", "items")
  order!: any;

  @ManyToOne(() => Book, (book) => book.orderItems)
  book!: Book;

  @Column()
  quantity!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number; // precio al momento de la compra
}
