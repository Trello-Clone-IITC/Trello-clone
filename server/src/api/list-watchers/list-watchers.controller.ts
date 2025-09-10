import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError.js";
import type { ApiResponse } from "../../utils/globalTypes.js";
import listWatchersService from "./list-watchers.service.js";
import type { ListWatcherDto } from "@ronmordo/types";
import { mapListWatcherToDto } from "./list-watcher.mapper.js";
import { DUMMY_USER_ID } from "../../utils/global.dummy.js";
import { userService } from "../users/user.service.js";

const addListWatcher = async (
  req: Request,
  res: Response<ApiResponse<{ message: string }>>,
  next: NextFunction
) => {
  try {
    const { listId } = req.params;
    const { userId } = req.body;
    const authUserId = await userService.getUserIdByRequest(req);

    if (!authUserId) {
      return next(new AppError("User not authenticated", 401));
    }

    const added = await listWatchersService.addListWatcher(listId, userId);

    if (!added) {
      return next(new AppError("Failed to add list watcher", 500));
    }

    res.status(201).json({
      success: true,
      data: { message: "List watcher added successfully" },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Failed to add list watcher", 500));
  }
};

const removeListWatcher = async (
  req: Request,
  res: Response<ApiResponse<{ message: string }>>,
  next: NextFunction
) => {
  try {
    const { listId, userId } = req.params;
    const authUserId = await userService.getUserIdByRequest(req);
    if (!authUserId) {
      return next(new AppError("User not authenticated", 401));
    }

    const removed = await listWatchersService.removeListWatcher(listId, userId);

    if (!removed) {
      return next(new AppError("List watcher not found", 404));
    }

    res.status(200).json({
      success: true,
      data: { message: "List watcher removed successfully" },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Failed to remove list watcher", 500));
  }
};

export default {
  addListWatcher,
  removeListWatcher,
};
