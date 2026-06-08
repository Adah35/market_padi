import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from "typeorm";
import { Transaction } from "./transactions";
import { Inventory } from "./inventory";
import { CustomerOrder } from "./customer";


@Entity("traders")
export class Trader {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  fullName: string;

  @Column({
    type: "enum",
    enum: ["pidgin", "english", "hausa", "yoruba", "igbo"],
    default: "english",
  })
  language: string;

  @Column({ nullable: true })
  businessName: string;

  @Column({ nullable: true })
  opayMerchantId: string;

  @Column({ unique: true })
  dashboardToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.trader)
  transactions: Transaction[];

  @OneToMany(() => Inventory, (inventory) => inventory.trader)
  inventory: Inventory[];

  @OneToMany(() => CustomerOrder, (order) => order.trader)
  orders: CustomerOrder[];
}