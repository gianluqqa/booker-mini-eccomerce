import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
export class Genre {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index({ unique: true })
  @Column()
  name!: string;
}
