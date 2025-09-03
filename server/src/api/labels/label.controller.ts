import { Request, Response } from "express";
import { labelService } from "./labelService.js";
import { AppError } from "../../utils/appError.js";
import { catchAsync } from "../../middlewares/errorHandler.js";

export const labelController = {
  // Create a new label
  createLabel: catchAsync(async (req: Request, res: Response) => {
    const { boardId, name, color } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const label = await labelService.createLabel({
      boardId,
      name,
      color,
      createdBy: userId,
    });

    res.status(201).json({
      status: "success",
      data: { label },
    });
  }),

  // Get label by ID
  getLabel: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const label = await labelService.getLabelById(id, userId);

    res.status(200).json({
      status: "success",
      data: { label },
    });
  }),

  // Get all labels for a board
  getBoardLabels: catchAsync(async (req: Request, res: Response) => {
    const { boardId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const labels = await labelService.getLabelsByBoard(boardId, userId);

    res.status(200).json({
      status: "success",
      data: { labels },
    });
  }),

  // Update label
  updateLabel: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, color } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const label = await labelService.updateLabel(
      id,
      {
        name,
        color,
      },
      userId
    );

    res.status(200).json({
      status: "success",
      data: { label },
    });
  }),

  // Delete label
  deleteLabel: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    await labelService.deleteLabel(id, userId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  }),

  // Add label to card
  addLabelToCard: catchAsync(async (req: Request, res: Response) => {
    const { cardId, labelId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const cardLabel = await labelService.addLabelToCard(
      cardId,
      labelId,
      userId
    );

    res.status(200).json({
      status: "success",
      data: { cardLabel },
    });
  }),

  // Remove label from card
  removeLabelFromCard: catchAsync(async (req: Request, res: Response) => {
    const { cardId, labelId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    await labelService.removeLabelFromCard(cardId, labelId, userId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  }),
};
