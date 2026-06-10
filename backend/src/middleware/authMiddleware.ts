import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedException } from "../errors/errors";
import { config } from "../config";

export interface AuthPayload extends JwtPayload {
  trader_id: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      trader?: AuthPayload;
    }
  }
}

const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const token =
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return next(new UnauthorizedException("Missing authorization token"));
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as AuthPayload;
    if (!decoded?.trader_id) {
      return next(new UnauthorizedException("Invalid token payload"));
    }
    req.trader = decoded;
    next();
  } catch (error) {
    console.log(error);
    next(new UnauthorizedException("Invalid or expired token"));
  }
};


export default authMiddleware;