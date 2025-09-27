import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import type { ApiResponse } from "../../utils/globalTypes.js";
import type {
  UpdateUserInput,
  UserDto,
  WorkspaceDto,
} from "@ronmordo/contracts";
import { userService } from "./user.service.js";
import workspaceService from "../workspaces/workspace.service.js";

const getMe = async (
  req: Request,
  res: Response<ApiResponse<UserDto>>,
  next: NextFunction
) => {
  try {
    const { userId } = getAuth(req);

    // Since we are protected by validation middleware we can assume safely that userId does exists on req object.
    const user = await userService.getMe(userId!);
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (
  req: Request<{}, {}, UpdateUserInput>,
  res: Response<ApiResponse<UserDto>>,
  next: NextFunction
) => {
  try {
    const userId = await userService.getUserIdByRequest(req);
    const updatedUser = await userService.updateUser(userId, req.body);

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    return next(err);
  }
};

const getAllWorkspaces = async (
  req: Request,
  res: Response<ApiResponse<WorkspaceDto[]>>,
  next: NextFunction
) => {
  try {
    const userId = (await userService.getUserIdByRequest(req)) || "";
    const workspaces = await workspaceService.getWorkspacesByUser(userId);
    return res.status(200).json({
      success: true,
      data: workspaces,
    });
  } catch (error) {
    return next(error);
  }
};

export const usersController = { getMe, updateUser, getAllWorkspaces };
