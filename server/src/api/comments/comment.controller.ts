import { Request, Response } from "express";
import { commentService } from "./commentService.js";
import { AppError } from "../../utils/appError.js";
import { catchAsync } from "../../middlewares/errorHandler.js";

export const commentController = {
  // Create a new comment
  createComment: catchAsync(async (req: Request, res: Response) => {
    const { cardId, text } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const comment = await commentService.createComment({
      cardId,
      text,
      userId,
    });

    res.status(201).json({
      status: "success",
      data: { comment },
    });
  }),

  // Get comment by ID
  getComment: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const comment = await commentService.getCommentById(id, userId);

    res.status(200).json({
      status: "success",
      data: { comment },
    });
  }),

  // Get all comments for a card
  getCardComments: catchAsync(async (req: Request, res: Response) => {
    const { cardId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const comments = await commentService.getCommentsByCard(cardId, userId);

    res.status(200).json({
      status: "success",
      data: { comments },
    });
  }),

  // Update comment
  updateComment: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const comment = await commentService.updateComment(id, { text }, userId);

    res.status(200).json({
      status: "success",
      data: { comment },
    });
  }),

  // Delete comment
  deleteComment: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    await commentService.deleteComment(id, userId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  }),
};
