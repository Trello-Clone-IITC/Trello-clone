import type { Request, Response, NextFunction } from "express";
import cardLabelService from "./card-label.service.js";
import type { ApiResponse } from "../../utils/globalTypes.js";
import { userService } from "../users/user.service.js";
import { mapCardLabelToDto } from "./card-label.mapper.js";
import type { CardLabelDto } from "@ronmordo/types";
import { AppError } from "../../utils/appError.js";

export const cardLabelController = {
  // Add label to card
  addLabelToCard: async (
    req: Request<{ cardId: string }, {}, { labelId: string }>,
    res: Response<ApiResponse<CardLabelDto>>,
    next: NextFunction
  ) => {
    try {
      const { cardId } = req.params;
      const { labelId } = req.body;
      const userId = await userService.getUserIdByRequest(req);
      const cardLabel = await cardLabelService.addLabelToCard(
        cardId,
        labelId,
        userId
      );

      const cardLabelDto: CardLabelDto = mapCardLabelToDto(cardLabel);

      res.status(200).json({
        success: true,
        data: cardLabelDto,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      return next(new AppError("Failed to add label to card", 500));
    }
  },

  // Remove label from card
  removeLabelFromCard: async (
    req: Request<{ cardId: string; labelId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { cardId, labelId } = req.params;
      const userId = await userService.getUserIdByRequest(req);
      await cardLabelService.removeLabelFromCard(cardId, labelId, userId);

      res.status(200).json({
        success: true,
        message: "Label removed from card successfully",
      });
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      return next(new AppError("Failed to remove label from card", 500));
    }
  },
};
