import checklistService from "./checklist.service.js";
import { AppError } from "../../utils/appError.js";
import { mapChecklistToDto, mapChecklistItemToDto, } from "./checklist.mapper.js";
import { mapChecklistItemAssigneeToDto } from "../checklist-item-assignees/checklist-item-assignee.mapper.js";
import { userService } from "../users/user.service.js";
export const checklistController = {
    // Create a new checklist
    createChecklist: async (req, res, next) => {
        try {
            const userId = (await userService.getUserIdByRequest(req)) ||
                "20c2f2d8-3de3-4b8e-8dbc-97038b9acb2b";
            const { cardId } = req.params;
            const checklist = await checklistService.createChecklist(req.body, cardId, userId);
            const checklistDto = mapChecklistToDto(checklist);
            res.status(201).json({
                success: true,
                data: checklistDto,
            });
        }
        catch (error) {
            console.error("Failed to create checklist", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to create checklist", 500));
        }
    },
    // Get checklist by ID
    getChecklist: async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = (await userService.getUserIdByRequest(req)) ||
                "20c2f2d8-3de3-4b8e-8dbc-97038b9acb2b";
            const checklist = await checklistService.getChecklistById(id, userId);
            const checklistDto = mapChecklistToDto(checklist);
            res.status(200).json({
                success: true,
                data: checklistDto,
            });
        }
        catch (error) {
            console.error("Failed to get checklist", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to get checklist", 500));
        }
    },
    // Update checklist
    updateChecklist: async (req, res, next) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const userId = (await userService.getUserIdByRequest(req)) ||
                "20c2f2d8-3de3-4b8e-8dbc-97038b9acb2b";
            const checklist = await checklistService.updateChecklist(id, updateData, userId);
            const checklistDto = mapChecklistToDto(checklist);
            res.status(200).json({
                success: true,
                data: checklistDto,
            });
        }
        catch (error) {
            console.error("Failed to update checklist", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to update checklist", 500));
        }
    },
    // Delete checklist
    deleteChecklist: async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = (await userService.getUserIdByRequest(req)) ||
                "20c2f2d8-3de3-4b8e-8dbc-97038b9acb2b";
            await checklistService.deleteChecklist(id, userId);
            res.status(200).json({
                success: true,
                message: "Checklist deleted successfully",
            });
        }
        catch (error) {
            console.error("Failed to delete checklist", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to delete checklist", 500));
        }
    },
    // Get checklist items
    getChecklistItems: async (req, res, next) => {
        try {
            //fixed to the parms
            const { checklistId } = req.params;
            const userId = (await userService.getUserIdByRequest(req)) ||
                "20c2f2d8-3de3-4b8e-8dbc-97038b9acb2b";
            const items = await checklistService.getChecklistItems(checklistId, userId);
            const itemDtos = items.map((item) => mapChecklistItemToDto(item));
            res.status(200).json({
                success: true,
                data: itemDtos,
            });
        }
        catch (error) {
            console.error("Failed to get checklist items", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to get checklist items", 500));
        }
    },
    // Create checklist item
    createChecklistItem: async (req, res, next) => {
        try {
            const userId = (await userService.getUserIdByRequest(req)) ||
                "188fa046-f70f-4406-875a-8c0c67456e3e";
            const { checklistId } = req.params;
            const item = await checklistService.createChecklistItem({
                checklistId,
                ...req.body,
                userId,
            });
            const itemDto = mapChecklistItemToDto(item);
            res.status(201).json({
                success: true,
                data: itemDto,
            });
        }
        catch (error) {
            console.error("Failed to create checklist item", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to create checklist item", 500));
        }
    },
    // Update checklist item
    updateChecklistItem: async (req, res, next) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const userId = (await userService.getUserIdByRequest(req)) ||
                "188fa046-f70f-4406-875a-8c0c67456e3e";
            const item = await checklistService.updateChecklistItem(id, updateData, userId);
            const itemDto = mapChecklistItemToDto(item);
            res.status(200).json({
                success: true,
                data: itemDto,
            });
        }
        catch (error) {
            console.error("Failed to update checklist item", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to update checklist item", 500));
        }
    },
    // Delete checklist item
    deleteChecklistItem: async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = (await userService.getUserIdByRequest(req)) ||
                "188fa046-f70f-4406-875a-8c0c67456e3e";
            await checklistService.deleteChecklistItem(id, userId);
            res.status(200).json({
                success: true,
                message: "Checklist item deleted successfully",
            });
        }
        catch (error) {
            console.error("Failed to delete checklist item", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to delete checklist item", 500));
        }
    },
    // Toggle checklist item completion
    toggleChecklistItem: async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = (await userService.getUserIdByRequest(req)) ||
                "188fa046-f70f-4406-875a-8c0c67456e3e";
            const item = await checklistService.toggleChecklistItem(id, userId);
            const itemDto = mapChecklistItemToDto(item);
            res.status(200).json({
                success: true,
                data: itemDto,
            });
        }
        catch (error) {
            console.error("Failed to toggle checklist item", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to toggle checklist item", 500));
        }
    },
    // Assign user to checklist item
    assignUserToItem: async (req, res, next) => {
        try {
            const userId = (await userService.getUserIdByRequest(req)) ||
                "188fa046-f70f-4406-875a-8c0c67456e3e";
            const { itemId, userId: assigneeId } = req.body;
            const assignment = await checklistService.assignUserToItem(itemId, assigneeId, userId);
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
                "188fa046-f70f-4406-875a-8c0c67456e3e";
            const { itemId, userId: assigneeId } = req.params;
            await checklistService.removeUserFromItem(itemId, assigneeId, userId);
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
