import type { Request, NextFunction, Response } from "express";
import { getAuth } from "@clerk/express";
import { AppError } from "../../utils/appError.js";

// This middleware should be used in each protected route handler function before the controller function.
export const validateAuthenticatedUser = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return next(new AppError("Unauthorized", 401));
  }
  next();
};
