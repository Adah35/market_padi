import { Router, Request, Response, NextFunction } from "express";
import { authService } from "../config/services/authService";
import { getStock } from "../config/services/inventoryService";
import { AppDataSource } from "../config/datasource";
import { Transaction } from "../entities/transactions";
import { CustomerOrder } from "../entities/customer";
import { AdashiGroup } from "../entities/adashe";
import { AdashiContribution } from "../entities/adasheContribution";
import { AdashiMember } from "../entities/adasheMember";
import { Inventory } from "../entities/inventory";
import { answerDashboardQuery, getMarketInsights } from "../config/services/geminiService";
import authMiddleware from "../middleware/authMiddleware";
import { BadRequestException } from "../errors/errors";

export const tradersRouter = Router();

// All routes require auth
tradersRouter.use(authMiddleware);

// GET /api/v1/traders/:trader_id/profile
tradersRouter.get("/:trader_id/profile", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await authService.getProfile(req.params.trader_id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// ── TRANSACTIONS ───────────────────────────────────────────────────────────

// GET /api/v1/traders/:trader_id/transactions/summary
tradersRouter.get("/:trader_id/transactions/summary", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { trader_id } = req.params;
    const repo = AppDataSource.getRepository(Transaction);

    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
    const weekStart = new Date(now); weekStart.setDate(now.getDate() - 6); weekStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const all = await repo.find({ where: { trader: { id: trader_id } } });
    const sales = all.filter(t => t.transactionType === "sale");
    const expenses = all.filter(t => t.transactionType === "expense");

    const sum = (txs: Transaction[]) => txs.reduce((s, t) => s + Number(t.totalAmount), 0);

    const todaySales = sales.filter(t => new Date(t.createdAt) >= todayStart);
    const weekSales = sales.filter(t => new Date(t.createdAt) >= weekStart);
    const monthSales = sales.filter(t => new Date(t.createdAt) >= monthStart);
    const monthExpenses = expenses.filter(t => new Date(t.createdAt) >= monthStart);

    // Daily revenue for last 7 days
    const dailyRevenue: { date: string; revenue: number; expenses: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day); dayEnd.setHours(23, 59, 59, 999);
      const label = day.toLocaleDateString("en-NG", { weekday: "short" });
      dailyRevenue.push({
        date: label,
        revenue: sum(sales.filter(t => new Date(t.createdAt) >= day && new Date(t.createdAt) <= dayEnd)),
        expenses: sum(expenses.filter(t => new Date(t.createdAt) >= day && new Date(t.createdAt) <= dayEnd)),
      });
    }

    // Top products by revenue (last 30 days)
    const last30 = new Date(now); last30.setDate(now.getDate() - 30);
    const recentSales = sales.filter(t => new Date(t.createdAt) >= last30);
    const productMap = new Map<string, { revenue: number; count: number }>();
    for (const t of recentSales) {
      const existing = productMap.get(t.itemName) ?? { revenue: 0, count: 0 };
      productMap.set(t.itemName, {
        revenue: existing.revenue + Number(t.totalAmount),
        count: existing.count + Number(t.quantity),
      });
    }
    const topProducts = [...productMap.entries()]
      .map(([name, data]) => ({ name, revenue: data.revenue, count: data.count }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    res.json({
      todaySales: { total: sum(todaySales), count: todaySales.length },
      weekSales: { total: sum(weekSales), count: weekSales.length },
      monthSales: { total: sum(monthSales), count: monthSales.length },
      monthExpenses: { total: sum(monthExpenses), count: monthExpenses.length },
      profit: sum(monthSales) - sum(monthExpenses),
      dailyRevenue,
      topProducts,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/traders/:trader_id/transactions
// Query: page, limit, type (sale|expense), search, from, to
tradersRouter.get("/:trader_id/transactions", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { trader_id } = req.params;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const type = req.query.type as string;
    const search = (req.query.search as string)?.toLowerCase() ?? "";
    const from = req.query.from ? new Date(req.query.from as string) : null;
    const to = req.query.to ? new Date(req.query.to as string) : null;

    const repo = AppDataSource.getRepository(Transaction);
    let query = repo.createQueryBuilder("tx")
      .where("tx.traderId = :id", { id: trader_id })
      .orderBy("tx.createdAt", "DESC");

    if (type === "sale" || type === "expense") {
      query = query.andWhere("tx.transactionType = :type", { type });
    }
    if (search) {
      query = query.andWhere("LOWER(tx.itemName) LIKE :search", { search: `%${search}%` });
    }
    if (from) query = query.andWhere("tx.createdAt >= :from", { from });
    if (to) {
      const toEnd = new Date(to); toEnd.setHours(23, 59, 59, 999);
      query = query.andWhere("tx.createdAt <= :to", { to: toEnd });
    }

    const total = await query.getCount();
    const transactions = await query.skip((page - 1) * limit).take(limit).getMany();

    res.json({
      data: transactions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

// ── INVENTORY ──────────────────────────────────────────────────────────────

// GET /api/v1/traders/:trader_id/inventory
tradersRouter.get("/:trader_id/inventory", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stock = await getStock(req.params.trader_id);
    const repo = AppDataSource.getRepository(Inventory);
    const full = await repo.find({ where: { trader: { id: req.params.trader_id } } });

    const data = stock.map(item => {
      const inv = full.find(i => i.itemName === item.itemName);
      return { ...item, id: inv?.id, updatedAt: inv?.updatedAt };
    });

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

// ── CUSTOMER ORDERS ────────────────────────────────────────────────────────

// GET /api/v1/traders/:trader_id/orders
tradersRouter.get("/:trader_id/orders", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { trader_id } = req.params;
    const status = req.query.status as string;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);

    const repo = AppDataSource.getRepository(CustomerOrder);
    let query = repo.createQueryBuilder("o")
      .where("o.traderId = :id", { id: trader_id })
      .orderBy("o.createdAt", "DESC");

    if (status && ["pending", "paid", "fulfilled"].includes(status)) {
      query = query.andWhere("o.status = :status", { status });
    }

    const total = await query.getCount();
    const orders = await query.skip((page - 1) * limit).take(limit).getMany();

    res.json({
      data: orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

// ── ADASHI (SAVINGS GROUPS) ────────────────────────────────────────────────

// GET /api/v1/traders/:trader_id/adashi
tradersRouter.get("/:trader_id/adashi", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { trader_id } = req.params;
    const groupRepo = AppDataSource.getRepository(AdashiGroup);
    const contribRepo = AppDataSource.getRepository(AdashiContribution);
    const memberRepo = AppDataSource.getRepository(AdashiMember);

    const groups = await groupRepo.find({ where: { owner: { id: trader_id } } });

    const enriched = await Promise.all(groups.map(async (g) => {
      const members = await memberRepo.find({ where: { group: { id: g.id } } });
      const contributions = await contribRepo.find({ where: { group: { id: g.id }, trader: { id: trader_id } } });
      const paid = contributions.filter(c => c.status === "paid");
      const totalContributed = paid.reduce((s, c) => s + Number(c.amount), 0);

      return {
        id: g.id,
        groupName: g.groupName,
        contributionAmount: Number(g.contributionAmount),
        frequency: g.frequency,
        type: g.type,
        goalAmount: g.goalAmount ? Number(g.goalAmount) : null,
        currentRound: g.currentRound,
        memberCount: members.length,
        totalContributed,
        pendingContributions: contributions.filter(c => c.status === "pending").length,
        createdAt: g.createdAt,
      };
    }));

    const totalContributed = enriched.reduce((s, g) => s + g.totalContributed, 0);
    const totalDue = enriched.reduce((s, g) => s + (g.pendingContributions * g.contributionAmount), 0);

    res.json({
      groups: enriched,
      summary: {
        totalGroups: enriched.length,
        totalContributed,
        totalDue,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── REPORTS ────────────────────────────────────────────────────────────────

// GET /api/v1/traders/:trader_id/reports?month=5&year=2026
tradersRouter.get("/:trader_id/reports", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { trader_id } = req.params;
    const now = new Date();
    const month = parseInt(req.query.month as string) ?? now.getMonth();
    const year = parseInt(req.query.year as string) ?? now.getFullYear();

    const repo = AppDataSource.getRepository(Transaction);
    const all = await repo.find({ where: { trader: { id: trader_id } } });

    const sum = (txs: Transaction[]) => txs.reduce((s, t) => s + Number(t.totalAmount), 0);

    // Monthly data for last 6 months
    const monthly: { month: string; revenue: number; expenses: number; profit: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - i, 1);
      const nextM = new Date(year, month - i + 1, 1);
      const label = d.toLocaleDateString("en-NG", { month: "short", year: "2-digit" });
      const mSales = all.filter(t => t.transactionType === "sale" && new Date(t.createdAt) >= d && new Date(t.createdAt) < nextM);
      const mExp = all.filter(t => t.transactionType === "expense" && new Date(t.createdAt) >= d && new Date(t.createdAt) < nextM);
      monthly.push({ month: label, revenue: sum(mSales), expenses: sum(mExp), profit: sum(mSales) - sum(mExp) });
    }

    const currentMonthStart = new Date(year, month, 1);
    const currentMonthEnd = new Date(year, month + 1, 1);
    const currentSales = all.filter(t => t.transactionType === "sale" && new Date(t.createdAt) >= currentMonthStart && new Date(t.createdAt) < currentMonthEnd);
    const currentExpenses = all.filter(t => t.transactionType === "expense" && new Date(t.createdAt) >= currentMonthStart && new Date(t.createdAt) < currentMonthEnd);

    res.json({
      monthly,
      currentMonth: {
        revenue: sum(currentSales),
        expenses: sum(currentExpenses),
        profit: sum(currentSales) - sum(currentExpenses),
        transactionCount: currentSales.length + currentExpenses.length,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── MARKET INTELLIGENCE ────────────────────────────────────────────────────

// GET /api/v1/traders/:trader_id/market-intel
tradersRouter.get("/:trader_id/market-intel", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await authService.getProfile(req.params.trader_id);
    const insights = await getMarketInsights(profile.businessName ?? "", profile.language as any);
    res.json({ insights });
  } catch (err) {
    next(err);
  }
});

// ── AI CHAT ────────────────────────────────────────────────────────────────

// POST /api/v1/traders/:trader_id/ai/chat
// Body: { message: string }
tradersRouter.post("/:trader_id/ai/chat", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { trader_id } = req.params;
    const { message } = req.body;
    if (!message) throw new BadRequestException("message is required");

    const txRepo = AppDataSource.getRepository(Transaction);
    const invRepo = AppDataSource.getRepository(Inventory);
    const profile = await authService.getProfile(trader_id);
    const transactions = await txRepo.find({ where: { trader: { id: trader_id } }, order: { createdAt: "DESC" }, take: 50 });
    const inventory = await invRepo.find({ where: { trader: { id: trader_id } } });

    const context = `
Trader: ${profile.fullName}, Business: ${profile.businessName || "My Business"}
Recent transactions (last 50): ${JSON.stringify(transactions.map(t => ({ item: t.itemName, qty: t.quantity, price: t.unitPrice, total: t.totalAmount, type: t.transactionType, date: t.createdAt })))}
Inventory: ${JSON.stringify(inventory.map(i => ({ item: i.itemName, qty: i.quantityAvailable, threshold: i.restockThreshold })))}
`.trim();

    const reply = await answerDashboardQuery(message, context, profile.language as any);
    res.json({ reply });
  } catch (err) {
    next(err);
  }
});
