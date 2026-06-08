import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { AdashiGroup } from "./adashe";
import { Trader } from "./trader";

@Entity("adashi_members")
export class AdashiMember {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => AdashiGroup)
  group: AdashiGroup;

  @ManyToOne(() => Trader)
  trader: Trader;

  @Column({
    default: false,
  })
  payoutReceived: boolean;
}