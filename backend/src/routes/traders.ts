import { Router, Request, Response, NextFunction } from "express";
import { authService } from "../config/services/authService";
import authMiddleware from "../middleware/authMiddleware";

export const tradersRouter = Router();

// GET /api/v1/traders/:trader_id/profile
// Called by the dashboard after token is verified, to populate the header
tradersRouter.get("/:trader_id/profile", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await authService.getProfile(req.params.trader_id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});
