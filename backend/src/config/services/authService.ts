import jwt from "jsonwebtoken";
import { AppDataSource } from "../datasource";
import { Trader } from "../../entities/trader";
import { config } from "../index";
import { NotFoundException } from "../../errors/errors";

const repo = () => AppDataSource.getRepository(Trader);

export class AuthService {
  async checkTrader(phoneNumber: string) {
    const trader = await repo().findOne({ where: { phoneNumber } });
    if (!trader) return { exists: false };
    return {
      exists: true,
      trader_id: trader.id,
      language: trader.language,
    };
  }

  async registerTrader(data: {
    phoneNumber: string;
    fullName: string;
    language: "pidgin" | "english" | "hausa" | "yoruba" | "igbo";
    businessName?: string;
  }) {
    const dashboardToken = crypto.randomUUID();
    const trader = repo().create({ ...data, dashboardToken });
    await repo().save(trader);
    return { trader_id: trader.id, dashboardToken };
  }

  async generateDashboardLink(traderId: string) {
    const trader = await repo().findOne({ where: { id: traderId } });
    if (!trader) throw new NotFoundException("Trader not found");

    const token = jwt.sign(
      { trader_id: trader.id, name: trader.fullName },
      config.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const url = `${config.DASHBOARD_BASE_URL}/d/${token}`;
    return { dashboard_url: url };
  }

  async getProfile(traderId: string) {
    const trader = await repo().findOne({ where: { id: traderId } });
    if (!trader) throw new NotFoundException("Trader not found");
    return {
      trader_id: trader.id,
      fullName: trader.fullName,
      phoneNumber: trader.phoneNumber,
      language: trader.language,
      businessName: trader.businessName,
      opayMerchantId: trader.opayMerchantId,
      createdAt: trader.createdAt,
    };
  }
}

export const authService = new AuthService();
