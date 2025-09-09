import type { Request, Response, NextFunction } from "express";
import commentService from "./comment.service.js";
import { AppError } from "../../utils/appError.js";
import type { ApiResponse } from "../../utils/globalTypes.js";
import type { CommentDto } from "@ronmordo/types";
import { mapCommentToDto } from "./comment.mapper.js";
import { getAuth } from "@clerk/express";
import { DUMMY_USER_ID } from "../../utils/global.dummy.js";

export const commentController = {
  // Create a new comment
  createComment: async (req: Request, res: Response<ApiResponse<CommentDto>>, next: NextFunction) => {
    try {
      let { userId } = getAuth(req) || {};
      if (!userId) {
        userId = DUMMY_USER_ID; // TODO: remove this after testing
      }

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const { cardId } = req.params;
      const comment = await commentService.createComment({
        cardId,
        ...req.body,
        userId,
      });
      const commentDto: CommentDto = mapCommentToDto(comment);

      res.status(201).json({
        success: true,
        data: commentDto,
      });
    } catch (error) {
      console.error("Failed to create comment", error);
      next(new AppError("Failed to create comment", 500));
    }
  },

  // Get a single comment by ID
  getComment: async (req: Request, res: Response<ApiResponse<CommentDto>>, next: NextFunction) => {
    try {
      const { id } = req.params;
      let { userId } = getAuth(req) || {};
      if (!userId) {
        userId = DUMMY_USER_ID; // TODO: remove this after testing
      }

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const comment = await commentService.getCommentById(id, userId);
      const commentDto: CommentDto = mapCommentToDto(comment);

      res.status(200).json({
        success: true,
        data: commentDto,
      });
    } catch (error) {
      console.error("Failed to get comment", error);
      next(new AppError("Failed to get comment", 500));
    }
  },


  // Update a comment
  updateComment: async (req: Request, res: Response<ApiResponse<CommentDto>>, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      let { userId } = getAuth(req) || {};
      if (!userId) {
        userId = DUMMY_USER_ID; // TODO: remove this after testing
      }

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const comment = await commentService.updateComment(id, updateData, userId);
      const commentDto: CommentDto = mapCommentToDto(comment);

      res.status(200).json({
        success: true,
        data: commentDto,
      });
    } catch (error) {
      console.error("Failed to update comment", error);
      next(new AppError("Failed to update comment", 500));
    }
  },

  // Delete a comment
  deleteComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      let { userId } = getAuth(req) || {};
      if (!userId) {
        userId = DUMMY_USER_ID; // TODO: remove this after testing
      }

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      await commentService.deleteComment(id, userId);

      res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete comment", error);
      next(new AppError("Failed to delete comment", 500));
    }
  },
};