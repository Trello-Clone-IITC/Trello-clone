import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";
import type { ApiResponse } from "../../utils/globalTypes.js";

const checkEmail = async (
  req: Request<{}, {}, {}, { email: string }>,
  res: Response<
    ApiResponse<{
      clerkUserExists: boolean;
      dbUserExists: boolean;
    }>
  >,
  next: NextFunction
) => {
  try {
    const emailVarificationData = await authService.checkEmail(req.query.email);
    return res.status(200).json({ success: true, data: emailVarificationData });
  } catch (err) {
    return next(err);
  }
};

const onBoarding = async (
  req: Request<
    {},
    {},
    Partial<{
      firstName: string;
      lastName: string;
      password: string;
    }>
  >,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const { userId } = getAuth(req);
    const { firstName, lastName, password } = req.body;

    await authService.onBoarding(userId!, firstName, lastName, password);
    return res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
};

export const authController = { onBoarding, checkEmail };
