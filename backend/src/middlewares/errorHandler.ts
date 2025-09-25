import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";
import type { ApiResponse } from "../utils/globalTypes.js";

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response<ApiResponse<Pick<AppError, "message" | "errors">>>,
  _next: NextFunction
) => {
  if (err instanceof Error) {
    console.log("Error:", err);
    return res.status(err instanceof AppError ? err.statusCode : 500).json({
      success: false,
      data: {
        message: err.message,
        errors: err instanceof AppError ? err.errors ?? [] : [],
      },
    });
  }

  console.error("Unhandled Error:", err);

  return res.status(500).json({
    success: false,
    data: {
      message: "Something went wrong. Please try again later.",
      errors: [],
    },
  });
};
