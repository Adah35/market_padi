import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { Trader } from "./trader";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Trader)
  trader: Trader;

  @Column()
  itemName: string;

  @Column("decimal")
  quantity: number;

  @Column("decimal")
  unitPrice: number;

  @Column("decimal")
  totalAmount: number;

  @Column({
    type: "enum",
    enum: ["sale", "expense"],
    default: "sale",
  })
  transactionType: string;

  @Column({
    type: "enum",
    enum: ["voice", "manual", "order"],
    default: "voice",
  })
  source: string;

  @Column()
  languageUsed: string;

  @CreateDateColumn()
  createdAt: Date;
}