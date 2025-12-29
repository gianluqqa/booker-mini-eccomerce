import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class StockReservation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @Column("text")
  itemsJson!: string; // Guardamos como texto JSON

  @Column("decimal", { precision: 10, scale: 2 })
  totalAmount!: number;

  @Column()
  expiresAt!: Date;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
