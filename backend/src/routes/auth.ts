import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authService } from "../config/services/authService";
import { sendOtp, verifyOtp } from "../config/services/otpService";
import { config } from "../config/index";
import { AppDataSource } from "../config/datasource";
import { Trader } from "../entities/trader";
import authMiddleware from "../middleware/authMiddleware";
import { BadRequestException, NotFoundException } from "../errors/errors";

export const authRouter = Router();

// ── WEBHOOK-FACING (no auth — called by Twilio webhook internally) ─────────

// GET /api/v1/auth/check-trader/:phone
authRouter.get("/check-trader/:phone", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.checkTrader(req.params.phone);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/auth/register
authRouter.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phoneNumber, fullName, language, businessName } = req.body;
    const result = await authService.registerTrader({ phoneNumber, fullName, language, businessName });
    res.status(201).json({ ...result, message: "Registration successful" });
  } catch (err) {
    next(err);
  }
});

// ── DASHBOARD LOGIN (OTP-based, no prior auth) ─────────────────────────────

// POST /api/v1/auth/send-otp
// Body: { phoneNumber: "+2348012345678" }
authRouter.post("/send-otp", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) throw new BadRequestException("phoneNumber is required");

    const repo = AppDataSource.getRepository(Trader);
    const trader = await repo.findOne({ where: { phoneNumber } });
    if (!trader) throw new NotFoundException("No account found for this number. Please register via WhatsApp first.");

    await sendOtp(phoneNumber);
    res.json({ message: "OTP sent to your WhatsApp number" });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/auth/verify-otp
// Body: { phoneNumber: "+2348012345678", otp: "123456" }
authRouter.post("/verify-otp", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) throw new BadRequestException("phoneNumber and otp are required");

    const valid = verifyOtp(phoneNumber, otp);
    if (!valid) throw new BadRequestException("Invalid or expired OTP");

    const repo = AppDataSource.getRepository(Trader);
    const trader = await repo.findOne({ where: { phoneNumber } });
    if (!trader) throw new NotFoundException("Trader not found");

    const token = jwt.sign(
      { trader_id: trader.id, name: trader.fullName },
      config.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      trader_id: trader.id,
      trader_name: trader.fullName,
      business_name: trader.businessName,
    });
  } catch (err) {
    next(err);
  }
});

// ── DASHBOARD-FACING (JWT required) ────────────────────────────────────────

// POST /api/v1/auth/generate-dashboard-link
authRouter.post(
  "/generate-dashboard-link",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.generateDashboardLink(req.trader!.trader_id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/v1/auth/verify-token
authRouter.get(
  "/verify-token",
  authMiddleware,
  (req: Request, res: Response) => {
    res.json({
      valid: true,
      trader_id: req.trader!.trader_id,
      trader_name: req.trader!.name,
    });
  }
);
