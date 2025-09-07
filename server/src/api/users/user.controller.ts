import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import type { ApiResponse } from "../../utils/globalTypes.js";
import type { UserDto } from "@ronmordo/types";
import { userService } from "./user.service.js";

const getMe = async (
  req: Request,
  res: Response<ApiResponse<UserDto>>,
  next: NextFunction
) => {
  try {
    const { userId } = getAuth(req);
    // const userId = "user_32KqXqyVpAZAJf6L1QwWwPLOfPl"; Uncomment to test.

    // Since we are protected by validation middleware we can assume safely that userId does exists on req object.
    const user = await userService.getMe(userId!);
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const usersController = { getMe };
