import attachmentService from "./attachment.service.js";
import { AppError } from "../../utils/appError.js";
import { mapAttachmentToDto } from "./attachment.mapper.js";
import { userService } from "../users/user.service.js";
export const attachmentController = {
    // Create a new attachment
    createAttachment: async (req, res, next) => {
        try {
            const userId = (await userService.getUserIdByRequest(req)) ||
                "3f992ec3-fd72-4153-8c8a-9575e5a61867";
            const { cardId } = req.params;
            const attachment = await attachmentService.createAttachment(req.body, cardId, userId);
            const attachmentDto = mapAttachmentToDto(attachment);
            res.status(201).json({
                success: true,
                data: attachmentDto,
            });
        }
        catch (error) {
            console.error("Failed to create attachment", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to create attachment", 500));
        }
    },
    // Get a single attachment by ID
    getAttachment: async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = (await userService.getUserIdByRequest(req)) ||
                "3f992ec3-fd72-4153-8c8a-9575e5a61867";
            if (!userId) {
                return next(new AppError("User not authenticated", 401));
            }
            const attachment = await attachmentService.getAttachmentById(id, userId);
            const attachmentDto = mapAttachmentToDto(attachment);
            res.status(200).json({
                success: true,
                data: attachmentDto,
            });
        }
        catch (error) {
            console.error("Failed to get attachment", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to get attachment", 500));
        }
    },
    // Update an attachment
    updateAttachment: async (req, res, next) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const userId = (await userService.getUserIdByRequest(req)) ||
                "3f992ec3-fd72-4153-8c8a-9575e5a61867";
            const attachment = await attachmentService.updateAttachment(id, {
                ...updateData,
                bytes: updateData.bytes ? BigInt(updateData.bytes) : undefined,
            }, userId);
            const attachmentDto = mapAttachmentToDto(attachment);
            res.status(200).json({
                success: true,
                data: attachmentDto,
            });
        }
        catch (error) {
            console.error("Failed to update attachment", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to update attachment", 500));
        }
    },
    // Delete an attachment
    deleteAttachment: async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = (await userService.getUserIdByRequest(req)) ||
                "3f992ec3-fd72-4153-8c8a-9575e5a61867";
            if (!userId) {
                return next(new AppError("User not authenticated", 401));
            }
            await attachmentService.deleteAttachment(id, userId);
            res.status(200).json({
                success: true,
                message: "Attachment deleted successfully",
            });
        }
        catch (error) {
            console.error("Failed to delete attachment", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to delete attachment", 500));
        }
    },
};
