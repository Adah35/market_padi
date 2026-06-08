import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from "typeorm";
import { AdashiGroup } from "./adashe";
import { Trader } from "./trader";

@Entity("adashi_contributions")
export class AdashiContribution {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => AdashiGroup)
  group: AdashiGroup;

  @ManyToOne(() => Trader)
  trader: Trader;

  @Column("decimal")
  amount: number;

  @Column()
  cycleNumber: number;

  @Column({ nullable: true })
  paymentReference: string;

  @Column({
    type: "enum",
    enum: ["pending", "paid"],
    default: "pending",
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}