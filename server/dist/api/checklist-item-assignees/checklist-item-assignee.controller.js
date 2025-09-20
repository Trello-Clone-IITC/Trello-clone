import checklistItemAssigneeService from "./checklist-item-assignee.service.js";
import { AppError } from "../../utils/appError.js";
import { mapChecklistItemAssigneeToDto } from "./checklist-item-assignee.mapper.js";
import { userService } from "../users/user.service.js";
export const checklistItemAssigneeController = {
    // Assign user to checklist item
    assignUserToItem: async (req, res, next) => {
        try {
            const userId = (await userService.getUserIdByRequest(req)) ||
                "20c2f2d8-3de3-4b8e-8dbc-97038b9acb2b";
            const { itemId } = req.params;
            const { userId: assigneeId } = req.body;
            const assignment = await checklistItemAssigneeService.assignUserToItem(itemId, assigneeId, userId);
            const assignmentDto = mapChecklistItemAssigneeToDto(assignment);
            res.status(200).json({
                success: true,
                data: assignmentDto,
            });
        }
        catch (error) {
            console.error("Failed to assign user to item", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to assign user to item", 500));
        }
    },
    // Remove user assignment from checklist item
    removeUserFromItem: async (req, res, next) => {
        try {
            const userId = (await userService.getUserIdByRequest(req)) ||
                "20c2f2d8-3de3-4b8e-8dbc-97038b9acb2b";
            const { itemId, userId: assigneeId } = req.params;
            await checklistItemAssigneeService.removeUserFromItem(itemId, assigneeId, userId);
            res.status(200).json({
                success: true,
                message: "User assignment removed successfully",
            });
        }
        catch (error) {
            console.error("Failed to remove user assignment", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to remove user assignment", 500));
        }
    },
};
