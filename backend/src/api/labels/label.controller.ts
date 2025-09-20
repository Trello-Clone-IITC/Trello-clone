import type { Request, Response, NextFunction } from "express";
import labelService from "./label.service.js";
import { AppError } from "../../utils/appError.js";
import type { ApiResponse } from "../../utils/globalTypes.js";
import type { LabelDto } from "@ronmordo/contracts";
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
      const userId =
        (await userService.getUserIdByRequest(req)) ||
        "96099bc0-34b7-4be5-b410-4d624cd99da5";
      const { id: boardId } = req.params;
      const label = await labelService.createLabel(req.body, boardId, userId);
      const labelDto: LabelDto = mapLabelToDto(label);

      res.status(201).json({
        success: true,
        data: labelDto,
      });
    } catch (error) {
      console.error("Failed to create label", error);
      if (error instanceof AppError) {
        return next(error);
      }
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
      const userId = await userService.getUserIdByRequest(req);

      if (!userId) {
        throw new AppError("UnAutherized", 403);
      }

      const label = await labelService.getLabelById(id, labelId, userId);

      res.status(200).json({
        success: true,
        data: label,
      });
    } catch (error) {
      console.error("Failed to get label", error);
      if (error instanceof AppError) {
        return next(error);
      }
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
      const { labelId } = req.params;
      const updateData = req.body;
      const userId =
        (await userService.getUserIdByRequest(req)) ||
        "96099bc0-34b7-4be5-b410-4d624cd99da5";
      const label = await labelService.updateLabel(updateData, labelId, userId);
      const labelDto: LabelDto = mapLabelToDto(label);

      res.status(200).json({
        success: true,
        data: labelDto,
      });
    } catch (error) {
      console.error("Failed to update label", error);
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to update label", 500));
    }
  },

  // Delete a label
  deleteLabel: async (
    req: Request,
    res: Response<ApiResponse<{ message: string }>>,
    next: NextFunction
  ) => {
    try {
      const { labelId } = req.params;
      const userId =
        (await userService.getUserIdByRequest(req)) ||
        "96099bc0-34b7-4be5-b410-4d624cd99da5";
      await labelService.deleteLabel(labelId, userId);

      res.status(200).json({
        success: true,
        message: "Label deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete label", error);
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to delete label", 500));
    }
  },
};
