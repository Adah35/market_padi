import { Router, Request, Response, NextFunction } from "express";
import { authService } from "../config/services/authService";

export const authRouter = Router();

// GET /api/v1/auth/check-trader/:phone
// Called by the WhatsApp bot on every incoming message
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

// POST /api/v1/auth/generate-dashboard-link
// Body: { trader_id }
// Called by the bot when trader says "show my dashboard"
authRouter.post("/generate-dashboard-link", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { trader_id } = req.body;
    const result = await authService.generateDashboardLink(trader_id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/auth/verify-token/:token
// Called by the React dashboard on every page load to validate the URL token
authRouter.get("/verify-token/:token", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.verifyToken(req.params.token);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
