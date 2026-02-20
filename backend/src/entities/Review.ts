import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Book } from "./Book";
import { User } from "./User";

@Entity()
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  comment!: string;

  @Column({ type: "int" })
  rating!: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  title!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relaciones
  @ManyToOne(() => Book, (book) => book.reviews, { onDelete: "CASCADE" })
  @JoinColumn({ name: "bookId" })
  book!: Book;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  bookId!: string;

  @Column()
  userId!: string;
}
