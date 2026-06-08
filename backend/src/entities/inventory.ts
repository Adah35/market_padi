import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Trader } from "./trader";

@Entity("inventory")
export class Inventory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Trader)
  trader: Trader;

  @Column()
  itemName: string;

  @Column("decimal")
  quantityAvailable: number;

  @Column("decimal", { default: 0 })
  restockThreshold: number;

  @UpdateDateColumn()
  updatedAt: Date;
}