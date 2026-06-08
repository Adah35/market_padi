import { AppDataSource } from "../datasource";
import { Inventory } from "../../entities/inventory";
import { Trader } from "../../entities/trader";

const repo = () => AppDataSource.getRepository(Inventory);

export async function getStock(traderId: string) {
  const items = await repo().find({
    where: { trader: { id: traderId } },
  });

  return items.map((item) => ({
    itemName: item.itemName,
    quantity: Number(item.quantityAvailable),
    threshold: Number(item.restockThreshold),
    status:
      item.quantityAvailable <= 0
        ? "out"
        : item.quantityAvailable <= item.restockThreshold
        ? "low"
        : "ok",
  }));
}

export async function addStock(traderId: string, itemName: string, quantityToAdd: number) {
  const traderRef = { id: traderId } as Trader;
  let item = await repo().findOne({ where: { trader: traderRef, itemName } });

  if (!item) {
    item = repo().create({
      trader: traderRef,
      itemName,
      quantityAvailable: quantityToAdd,
      restockThreshold: 5,
    });
  } else {
    item.quantityAvailable = Number(item.quantityAvailable) + quantityToAdd;
  }

  await repo().save(item);
  return item;
}
