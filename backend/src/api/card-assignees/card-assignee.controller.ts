import type { CardIdParam } from "@ronmordo/contracts";
import type { CardAssigneeDto } from "@ronmordo/contracts";
import type { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "../../utils/globalTypes.js";
import { cardAssgineeService } from "./card-assignee.service.js";
import { userService } from "../users/user.service.js";
import { AppError } from "../../utils/appError.js";

const createCardAssignee = async (
  req: Request<CardIdParam>,
  res: Response<ApiResponse<CardAssigneeDto>>,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const userId = await userService.getUserIdByRequest(req);

    if (!userId) {
      throw new AppError("UnAutherized", 403);
    }

    const cardAssignee = await cardAssgineeService.createCardAssignee(
      cardId,
      userId
    );

    return res.status(201).json({ success: true, data: cardAssignee });
  } catch (err) {
    return next(err);
  }
};

const deleteCardAssignee = async (
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

    await cardAssgineeService.deleteCardAssignee(cardId, userId);

    return res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
};

export const cardAssigneeController = {
  createCardAssignee,
  deleteCardAssignee,
};
