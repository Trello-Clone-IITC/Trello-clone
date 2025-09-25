import type { CardIdParam, CardWatcherDto } from "@ronmordo/contracts";
import type { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "../../utils/globalTypes.js";
import { cardWatcherService } from "./card-watcher.service.js";
import { userService } from "../users/user.service.js";
import { AppError } from "../../utils/appError.js";

const createCardWatcher = async (
  req: Request<CardIdParam>,
  res: Response<ApiResponse<CardWatcherDto>>,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const userId = await userService.getUserIdByRequest(req);

    if (!userId) {
      throw new AppError("UnAutherized", 403);
    }

    const cardWatcher = await cardWatcherService.createCardWatcher(
      cardId,
      userId
    );

    return res.status(201).json({ success: true, data: cardWatcher });
  } catch (err) {
    return next(err);
  }
};

const deleteCardWatcher = async (
  req: Request<CardIdParam>,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const userId = await userService.getUserIdByRequest(req);

    if (!userId) {
      throw new AppError("UnAutherized", 403);
    }

    await cardWatcherService.deleteCardWatcher(cardId, userId);

    return res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
};

export const cardWatcherController = {
  createCardWatcher,
  deleteCardWatcher,
};
