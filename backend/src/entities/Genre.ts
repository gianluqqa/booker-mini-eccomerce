import { Entity, PrimaryColumn, Column, Index } from "typeorm";

@Entity()
export class Genre {
  @PrimaryColumn()
  id!: string;

  @Index({ unique: true })
  @Column()
  name!: string;
}
