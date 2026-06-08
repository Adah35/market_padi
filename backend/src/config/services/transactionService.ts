import { AppDataSource } from "../datasource";
import { Transaction } from "../../entities/transactions";
import { Inventory } from "../../entities/inventory";
import { Trader } from "../../entities/trader";
import { sendWhatsApp } from "./twilioService";

const txRepo = () => AppDataSource.getRepository(Transaction);
const invRepo = () => AppDataSource.getRepository(Inventory);

export interface RecordSaleInput {
  traderId: string;
  traderPhone: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  transactionType: "sale" | "expense";
  source: "voice" | "manual" | "order";
  languageUsed: string;
}

export async function recordTransaction(input: RecordSaleInput) {
  const traderRef = { id: input.traderId } as Trader;

  // 1. Save transaction
  const tx = txRepo().create({
    trader: traderRef,
    itemName: input.itemName,
    quantity: input.quantity,
    unitPrice: input.unitPrice,
    totalAmount: input.totalAmount,
    transactionType: input.transactionType,
    source: input.source,
    languageUsed: input.languageUsed,
  });
  await txRepo().save(tx);

  // 2. Decrement inventory on sales only
  let lowStockAlert: string | null = null;
  if (input.transactionType === "sale") {
    const item = await invRepo().findOne({
      where: { trader: traderRef, itemName: input.itemName },
    });

    if (item) {
      item.quantityAvailable = Math.max(0, Number(item.quantityAvailable) - input.quantity);
      await invRepo().save(item);

      if (item.quantityAvailable <= Number(item.restockThreshold)) {
        lowStockAlert = `⚠️ Low stock: only ${item.quantityAvailable} ${input.itemName} left!`;
        sendWhatsApp(
          input.traderPhone,
          lowStockAlert
        ).catch(() => {});
      }
    }
  }

  // 3. Today's running total (sales only)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayTxs = await txRepo()
    .createQueryBuilder("tx")
    .where("tx.traderId = :id", { id: input.traderId })
    .andWhere("tx.transactionType = 'sale'")
    .andWhere("tx.createdAt >= :start", { start: todayStart })
    .getMany();

  const dailyTotal = todayTxs.reduce((sum, t) => sum + Number(t.totalAmount), 0);

  return { transaction: tx, dailyTotal, lowStockAlert };
}

export async function getTodaySummary(traderId: string) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const txs = await txRepo()
    .createQueryBuilder("tx")
    .where("tx.traderId = :id", { id: traderId })
    .andWhere("tx.transactionType = 'sale'")
    .andWhere("tx.createdAt >= :start", { start: todayStart })
    .getMany();

  const total = txs.reduce((sum, t) => sum + Number(t.totalAmount), 0);
  return { total, count: txs.length, transactions: txs };
}
