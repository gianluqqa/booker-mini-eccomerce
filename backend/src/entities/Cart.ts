import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Book } from "./Book";

@Entity("carts")
export class Cart {
  @PrimaryGeneratedColumn()
  id!: string;

  @ManyToOne(() => User, (user) => user.carts, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Book, (book) => book.carts, { eager: true })
  book!: Book;

  @Column({ type: "int", default: 1 })
  quantity!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
