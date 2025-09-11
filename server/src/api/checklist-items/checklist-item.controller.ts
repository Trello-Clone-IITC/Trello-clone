import type { Request, Response, NextFunction } from "express";
import checklistItemService from "./checklist-item.service.js";
import { AppError } from "../../utils/appError.js";
import type { ApiResponse } from "../../utils/globalTypes.js";
import type { ChecklistItemDto, UserDto } from "@ronmordo/contracts";
import { mapChecklistItemToDto } from "./checklist-item.mapper.js";
import { mapUserToDto } from "../users/user.mapper.js";
import { userService } from "../users/user.service.js";

export const checklistItemController = {
  // Create checklist item
  createChecklistItem: async (
    req: Request,
    res: Response<ApiResponse<ChecklistItemDto>>,
    next: NextFunction
  ) => {
    try {
      const userId = await userService.getUserIdByRequest(req);

      const { checklistId } = req.params;
      const item = await checklistItemService.createChecklistItem({
        checklistId,
        ...req.body,
        userId,
      });
      const itemDto: ChecklistItemDto = mapChecklistItemToDto(item);

      res.status(201).json({
        success: true,
        data: itemDto,
      });
    } catch (error) {
      console.error("Failed to create checklist item", error);
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to create checklist item", 500));
    }
  },

  // Get checklist item by ID
  getChecklistItem: async (
    req: Request,
    res: Response<ApiResponse<ChecklistItemDto>>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = await userService.getUserIdByRequest(req);

      const item = await checklistItemService.getChecklistItemById(id, userId);
      const itemDto: ChecklistItemDto = mapChecklistItemToDto(item);

      res.status(200).json({
        success: true,
        data: itemDto,
      });
    } catch (error) {
      console.error("Failed to get checklist item", error);
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to get checklist item", 500));
    }
  },

  // Update checklist item
  updateChecklistItem: async (
    req: Request,
    res: Response<ApiResponse<ChecklistItemDto>>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = await userService.getUserIdByRequest(req);

      const item = await checklistItemService.updateChecklistItem(
        id,
        updateData,
        userId
      );
      const itemDto: ChecklistItemDto = mapChecklistItemToDto(item);

      res.status(200).json({
        success: true,
        data: itemDto,
      });
    } catch (error) {
      console.error("Failed to update checklist item", error);
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to update checklist item", 500));
    }
  },

  // Delete checklist item
  deleteChecklistItem: async (
    req: Request,
    res: Response<ApiResponse<{ message: string }>>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = await userService.getUserIdByRequest(req);

      await checklistItemService.deleteChecklistItem(id, userId);

      res.status(200).json({
        success: true,
        message: "Checklist item deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete checklist item", error);
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to delete checklist item", 500));
    }
  },

  // Toggle checklist item completion
  toggleChecklistItem: async (
    req: Request,
    res: Response<ApiResponse<ChecklistItemDto>>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = await userService.getUserIdByRequest(req);

      const item = await checklistItemService.toggleChecklistItem(id, userId);
      const itemDto: ChecklistItemDto = mapChecklistItemToDto(item);

      res.status(200).json({
        success: true,
        data: itemDto,
      });
    } catch (error) {
      console.error("Failed to toggle checklist item", error);
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to toggle checklist item", 500));
    }
  },

  // Get checklist item assignees
  getChecklistItemAssignees: async (
    req: Request,
    res: Response<ApiResponse<UserDto[]>>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = await userService.getUserIdByRequest(req);

      const assignees = await checklistItemService.getChecklistItemAssignees(
        id,
        userId
      );
      const assigneesDto = assignees.map((assignee) =>
        mapUserToDto(assignee.user)
      );

      res.status(200).json({
        success: true,
        data: assigneesDto,
      });
    } catch (error) {
      console.error("Failed to get checklist item assignees", error);
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to get checklist item assignees", 500));
    }
  },
};
