import { Request, Response, NextFunction } from "express";
import { HttpException } from "../errors/root";

const errorHandler = async (
    err:Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
   if (err instanceof HttpException) {
		return res.status(err.status).json({
			success: false,
			message: err.message,
			errorCode: err.errorCode,
			errors: err.errors,
			stack: process.env.NODE_ENV === "production" ? null : err.stack,
		});
	}

	// Default fallback
	const status = res.statusCode !== 200 ? res.statusCode : 500;
	return res.status(status).json({
		success: false,
		message: err.message || "Internal Server Error",
		status,
		stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
    
}

export default errorHandler