import { AppError } from "../../utils/appError.js";
import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";
import { getAuth } from "@clerk/express";
import { ApiResponse } from "../../utils/globalTypes.js";
import { User } from "@prisma/client";

const getMe = async (
  req: Request,
  // res: Response<ApiResponse<User | null>>,
  res: Response,
  next: NextFunction
) => {
  try {
    let { userId } = getAuth(req);
    console.log("userId", userId);
    userId = userId ? userId : req.body.userId;
    console.log("userId2", userId);

    if (!userId) {
      throw new AppError("No token provided.", 400);
    }
    const user = await authService.getMe(userId);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const authController = { getMe };
