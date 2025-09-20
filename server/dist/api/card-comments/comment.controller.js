import commentService from "./comment.service.js";
import { AppError } from "../../utils/appError.js";
import { mapCommentToDto } from "./comment.mapper.js";
import { userService } from "../users/user.service.js";
export const commentController = {
    // Create a new comment
    createComment: async (req, res, next) => {
        try {
            const userId = (await userService.getUserIdByRequest(req)) ||
                "3f992ec3-fd72-4153-8c8a-9575e5a61867";
            const { id: cardId } = req.params;
            const comment = await commentService.createComment({
                cardId,
                ...req.body,
                userId,
            });
            const commentDto = mapCommentToDto(comment);
            res.status(201).json({
                success: true,
                data: commentDto,
            });
        }
        catch (error) {
            console.error("Failed to create comment", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to create comment", 500));
        }
    },
    // Get a single comment by ID
    getComment: async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = (await userService.getUserIdByRequest(req)) ||
                "3f992ec3-fd72-4153-8c8a-9575e5a61867";
            const comment = await commentService.getCommentById(id, userId);
            const commentDto = mapCommentToDto(comment);
            res.status(200).json({
                success: true,
                data: commentDto,
            });
        }
        catch (error) {
            console.error("Failed to get comment", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to get comment", 500));
        }
    },
    // Update a comment
    updateComment: async (req, res, next) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const userId = (await userService.getUserIdByRequest(req)) ||
                "3f992ec3-fd72-4153-8c8a-9575e5a61867";
            const comment = await commentService.updateComment(id, updateData, userId);
            const commentDto = mapCommentToDto(comment);
            res.status(200).json({
                success: true,
                data: commentDto,
            });
        }
        catch (error) {
            console.error("Failed to update comment", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to update comment", 500));
        }
    },
    // Delete a comment
    deleteComment: async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = (await userService.getUserIdByRequest(req)) ||
                "3f992ec3-fd72-4153-8c8a-9575e5a61867";
            await commentService.deleteComment(id, userId);
            res.status(200).json({
                success: true,
                message: "Comment deleted successfully",
            });
        }
        catch (error) {
            console.error("Failed to delete comment", error);
            if (error instanceof AppError) {
                return next(error);
            }
            next(new AppError("Failed to delete comment", 500));
        }
    },
};
