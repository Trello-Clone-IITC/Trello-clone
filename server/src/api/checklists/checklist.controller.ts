import type { Request, Response } from "express";
import { checklistService } from "./checklistService.js";
import { AppError } from "../../utils/appError.js";
import { catchAsync } from "../../middlewares/errorHandler.js";

export const checklistController = {
  // Create a new checklist
  createChecklist: catchAsync(async (req: Request, res: Response) => {
    const { cardId, title, position } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const checklist = await checklistService.createChecklist({
      cardId,
      title,
      position: parseFloat(position) || 1000,
      createdBy: userId,
    });

    res.status(201).json({
      status: "success",
      data: { checklist },
    });
  }),

  // Get checklist by ID
  getChecklist: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const checklist = await checklistService.getChecklistById(id, userId);

    res.status(200).json({
      status: "success",
      data: { checklist },
    });
  }),

  // Update checklist
  updateChecklist: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, position } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const checklist = await checklistService.updateChecklist(
      id,
      {
        title,
        position: position ? parseFloat(position) : undefined,
      },
      userId
    );

    res.status(200).json({
      status: "success",
      data: { checklist },
    });
  }),

  // Delete checklist
  deleteChecklist: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    await checklistService.deleteChecklist(id, userId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  }),

  // Create checklist item
  createChecklistItem: catchAsync(async (req: Request, res: Response) => {
    const { checklistId, text, dueDate, position } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const item = await checklistService.createChecklistItem({
      checklistId,
      text,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      position: parseFloat(position) || 1000,
      createdBy: userId,
    });

    res.status(201).json({
      status: "success",
      data: { item },
    });
  }),

  // Update checklist item
  updateChecklistItem: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { text, isCompleted, dueDate, position } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const item = await checklistService.updateChecklistItem(
      id,
      {
        text,
        isCompleted,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        position: position ? parseFloat(position) : undefined,
      },
      userId
    );

    res.status(200).json({
      status: "success",
      data: { item },
    });
  }),

  // Delete checklist item
  deleteChecklistItem: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    await checklistService.deleteChecklistItem(id, userId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  }),

  // Toggle checklist item completion
  toggleChecklistItem: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const item = await checklistService.toggleChecklistItem(id, userId);

    res.status(200).json({
      status: "success",
      data: { item },
    });
  }),

  // Assign user to checklist item
  assignUserToItem: catchAsync(async (req: Request, res: Response) => {
    const { itemId, userId: assigneeId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const assignment = await checklistService.assignUserToItem(
      itemId,
      assigneeId,
      userId
    );

    res.status(200).json({
      status: "success",
      data: { assignment },
    });
  }),

  // Remove user assignment from checklist item
  removeUserFromItem: catchAsync(async (req: Request, res: Response) => {
    const { itemId, userId: assigneeId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    await checklistService.removeUserFromItem(itemId, assigneeId, userId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  }),
};
