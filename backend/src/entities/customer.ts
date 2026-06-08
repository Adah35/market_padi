import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { Trader } from "./trader";


@Entity("customer_orders")
export class CustomerOrder {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Trader)
  trader: Trader;

  @Column()
  customerPhone: string;

  @Column("json")
  items: {
    itemName: string;
    quantity: number;
    unitPrice: number;
  }[];

  @Column("decimal")
  totalAmount: number;

  @Column({ nullable: true })
  paymentLink: string;

  @Column({ nullable: true })
  paymentReference: string;

  @Column({
    type: "enum",
    enum: ["pending", "paid", "fulfilled"],
    default: "pending",
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}