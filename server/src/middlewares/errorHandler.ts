import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { ApiResponse } from "../utils/globalTypes";

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
