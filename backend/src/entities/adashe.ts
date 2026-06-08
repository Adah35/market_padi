import {Entity,Column,PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne} from "typeorm"
import { Trader } from "./trader";

@Entity("adashi_groups")
export class AdashiGroup {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  groupName: string;

  @ManyToOne(() => Trader)
  owner: Trader;

  @Column("decimal")
  contributionAmount: number;

  @Column({
    type: "enum",
    enum: ["weekly", "monthly"],
  })
  frequency: string;

  @Column({
    type: "enum",
    enum: ["rotating", "goal_based"],
    default: "rotating",
  })
  type: string;

  @Column("decimal", {
    nullable: true,
  })
  goalAmount: number;

  @Column({ default: 1 })
  currentRound: number;

  @CreateDateColumn()
  createdAt: Date;
}