import type { ActivityLogFullDto, CardIdParam } from "@ronmordo/contracts";
import type { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "../../utils/globalTypes.js";
import { activityLogService } from "./activity-log.service.js";
import { userService } from "../users/user.service.js";
import { AppError } from "../../utils/appError.js";
import cardService from "../cards/card.service.js";

const getActivityLogs = async (
  req: Request<CardIdParam | any>,
  res: Response<ApiResponse<ActivityLogFullDto[]>>,
  next: NextFunction
) => {
  try {
    const userId =
      (await userService.getUserIdByRequest(req)) ||
      "20c2f2d8-3de3-4b8e-8dbc-97038b9acb2b";
    const { cardId } = req.params;

    if (!userId) {
      throw new AppError("UnAutherized", 403);
    }

    const activityLogs = await Promise.all(
      cardId
        ? await cardService.getCardActivity(cardId, userId)
        : await activityLogService.getGeneralActivityLogs(userId)
    );

    return res.status(201).json({ success: true, data: activityLogs });
  } catch (err) {
    return next(err);
  }
};

export const activityLogController = {
  getActivityLogs,
};
