import type { Request, Response } from "express";
import { cardService } from "./cardService.js";
import { AppError } from "../../utils/appError.js";
import { catchAsync } from "../../middlewares/errorHandler.js";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const cardController = {
  // Create a new card
  createCard: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const {
      listId,
      title,
      description,
      dueDate,
      startDate,
      position,
      coverImageUrl,
      userId,
    } = req.body;
    // const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const card = await cardService.createCard({
      listId,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      position: parseFloat(position),
      coverImageUrl,
      createdBy: userId,
    });

    res.status(201).json({
      status: "success",
      data: { card },
    });
  }),

  // Get a single card by ID with all related data
  getCard: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const card = await cardService.getCardById(id, userId);

    res.status(200).json({
      status: "success",
      data: { card },
    });
  }),

  // Get all cards for a list
  getCardsByList: catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const { listId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const cards = await cardService.getCardsByList(listId, userId);

      res.status(200).json({
        status: "success",
        data: { cards },
      });
    }
  ),

  // Update a card
  updateCard: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const card = await cardService.updateCard(id, updateData, userId);

    res.status(200).json({
      status: "success",
      data: { card },
    });
  }),

  // Delete a card
  deleteCard: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    await cardService.deleteCard(id, userId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  }),

  // Move card to different list/position
  moveCard: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { listId, position } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const card = await cardService.moveCard(
      id,
      listId,
      parseFloat(position),
      userId
    );

    res.status(200).json({
      status: "success",
      data: { card },
    });
  }),

  // Archive/Unarchive a card
  toggleArchive: catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const card = await cardService.toggleArchive(id, userId);

      res.status(200).json({
        status: "success",
        data: { card },
      });
    }
  ),

  // Search cards
  searchCards: catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { query, boardId, listId } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    if (!query || typeof query !== "string") {
      throw new AppError("Search query is required", 400);
    }

    const cards = await cardService.searchCards(
      query,
      {
        boardId: boardId as string,
        listId: listId as string,
      },
      userId
    );

    res.status(200).json({
      status: "success",
      data: { cards },
    });
  }),

  // Get card activity
  getCardActivity: catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const activities = await cardService.getCardActivity(id, userId);

      res.status(200).json({
        status: "success",
        data: { activities },
      });
    }
  ),

  // Subscribe/Unsubscribe to card
  toggleSubscription: catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const card = await cardService.toggleSubscription(id, userId);

      res.status(200).json({
        status: "success",
        data: { card },
      });
    }
  ),
};
