import { Router, Request, Response, NextFunction } from "express";
import { authService } from "../config/services/authService";
import authMiddleware from "../middleware/authMiddleware";

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
// Body: { phoneNumber, fullName, language, businessName? }
authRouter.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phoneNumber, fullName, language, businessName } = req.body;
    const result = await authService.registerTrader({ phoneNumber, fullName, language, businessName });
    res.status(201).json({ ...result, message: "Registration successful" });
  } catch (err) {
    next(err);
  }
});

// ── DASHBOARD-FACING (JWT required — trader_id always comes from the token) ─

// POST /api/v1/auth/generate-dashboard-link
// Authorization: Bearer <jwt>
// Trader_id is read from the verified JWT, never from the request body,
// so a caller cannot generate a link for a different trader's account.
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
// Authorization: Bearer <dashboard-jwt>
// The dashboard sends the token from the URL as the Bearer token.
// Auth middleware validates the JWT and populates req.trader.
// This route just surfaces that decoded payload to the frontend.
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
