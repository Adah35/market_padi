import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Trader } from "./trader";

@Entity("ai_logs")
export class AILog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Trader)
  trader: Trader;

  @Column("text")
  originalMessage: string;

  @Column("json")
  extractedData: Record<string, any>;

  @Column()
  intent: string;

  @CreateDateColumn()
  createdAt: Date;
}