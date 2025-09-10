import type { Request, Response, NextFunction } from "express";
import labelService from "./label.service.js";
import { AppError } from "../../utils/appError.js";
import type { ApiResponse } from "../../utils/globalTypes.js";
import type { LabelDto } from "@ronmordo/types";
import { mapLabelToDto } from "./label.mapper.js";
import { userService } from "../users/user.service.js";

export const labelController = {
  // Create a new label
  createLabel: async (
    req: Request,
    res: Response<ApiResponse<LabelDto>>,
    next: NextFunction
  ) => {
    try {
      const userId = await userService.getUserIdByRequest(req);
      const { id: boardId } = req.params;
      const label = await labelService.createLabel({
        boardId,
        ...req.body,
        userId,
      });
      const labelDto: LabelDto = mapLabelToDto(label);

      res.status(201).json({
        success: true,
        data: labelDto,
      });
    } catch (error) {
      console.error("Failed to create label", error);
      next(new AppError("Failed to create label", 500));
    }
  },

  // Get a single label by ID
  getLabel: async (
    req: Request,
    res: Response<ApiResponse<LabelDto>>,
    next: NextFunction
  ) => {
    try {
      const { id, labelId } = req.params;
      const label = await labelService.getLabelById(id, labelId);
      const labelDto: LabelDto = mapLabelToDto(label);

      res.status(200).json({
        success: true,
        data: labelDto,
      });
    } catch (error) {
      console.error("Failed to get label", error);
      next(new AppError("Failed to get label", 500));
    }
  },

  // Update a label
  updateLabel: async (
    req: Request,
    res: Response<ApiResponse<LabelDto>>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = await userService.getUserIdByRequest(req);
      const label = await labelService.updateLabel(id, updateData, userId);
      const labelDto: LabelDto = mapLabelToDto(label);

      res.status(200).json({
        success: true,
        data: labelDto,
      });
    } catch (error) {
      console.error("Failed to update label", error);
      next(new AppError("Failed to update label", 500));
    }
  },

  // Delete a label
  deleteLabel: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = await userService.getUserIdByRequest(req);
      await labelService.deleteLabel(id, userId);

      res.status(200).json({
        success: true,
        message: "Label deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete label", error);
      next(new AppError("Failed to delete label", 500));
    }
  },

  // Add label to card
  addLabelToCard: async (
    req: Request,
    res: Response<ApiResponse<{ cardId: string; labelId: string }>>,
    next: NextFunction
  ) => {
    try {
      const { cardId, labelId } = req.body;
      const userId = await userService.getUserIdByRequest(req);
      const cardLabel = await labelService.addLabelToCard(
        cardId,
        labelId,
        userId
      );

      res.status(200).json({
        success: true,
        data: {
          cardId: cardLabel.cardId,
          labelId: cardLabel.labelId,
        },
      });
    } catch (error) {
      console.error("Failed to add label to card", error);
      next(new AppError("Failed to add label to card", 500));
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
      await labelService.removeLabelFromCard(cardId, labelId, userId);

      res.status(200).json({
        success: true,
        message: "Label removed from card successfully",
      });
    } catch (error) {
      console.error("Failed to remove label from card", error);
      next(new AppError("Failed to remove label from card", 500));
    }
  },
};
