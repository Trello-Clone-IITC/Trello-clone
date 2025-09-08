import type { Request, Response, NextFunction } from "express";
import checklistItemAssigneeService from "./checklist-item-assignee.service.js";
import { AppError } from "../../utils/appError.js";
import type { ApiResponse } from "../../utils/globalTypes.js";
import { getAuth } from "@clerk/express";
import { DUMMY_USER_ID } from "../../utils/global.dummy.js";
import type { ChecklistItemAssigneeDto } from "@ronmordo/types";
import { mapChecklistItemAssigneeToDto } from "./checklist-item-assignee.mapper.js";

export const checklistItemAssigneeController = {
  // Assign user to checklist item
  assignUserToItem: async (req: Request, res: Response<ApiResponse<ChecklistItemAssigneeDto>>, next: NextFunction) => {
    try {
      let { userId } = getAuth(req) || {};
      if (!userId) {
        userId = DUMMY_USER_ID; // TODO: remove this after testing
      }

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const { itemId } = req.params;
      const { userId: assigneeId } = req.body;
      const assignment = await checklistItemAssigneeService.assignUserToItem(itemId, assigneeId, userId);
      const assignmentDto = mapChecklistItemAssigneeToDto(assignment);

      res.status(200).json({
        success: true,
        data: assignmentDto,
      });
    } catch (error) {
      console.error("Failed to assign user to item", error);
      next(new AppError("Failed to assign user to item", 500));
    }
  },

  // Remove user assignment from checklist item
  removeUserFromItem: async (req: Request, res: Response<ApiResponse<{ message: string }>>, next: NextFunction) => {
    try {
      let { userId } = getAuth(req) || {};
      if (!userId) {
        userId = DUMMY_USER_ID; // TODO: remove this after testing
      }

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const { itemId, userId: assigneeId } = req.params;
      await checklistItemAssigneeService.removeUserFromItem(itemId, assigneeId, userId);

      res.status(200).json({
        success: true,
        message: "User assignment removed successfully",
      });
    } catch (error) {
      console.error("Failed to remove user assignment", error);
      next(new AppError("Failed to remove user assignment", 500));
    }
  },
};
