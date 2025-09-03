import type { Request, Response, NextFunction } from "express";
import { cardService } from "./cardService.js";
import { AppError } from "../../utils/appError.js";


export const cardController = {
  // Create a new card
  createCard: async (req: Request, res: Response, next: NextFunction) => {
    try {
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
        return next(new AppError("User not authenticated", 401));
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
    } catch (error) {
      console.error("Failed to create card", error);
      next(new AppError("Failed to create card", 500));
    }
  },

  // Get a single card by ID with all related data
  getCard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      // const userId = req.user?.id; 
      const userId = req.body.userId;

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const card = await cardService.getCardById(id, userId);

      res.status(200).json({
        status: "success",
        data: { card },
      });
    } catch (error) {
      console.log("Failed to get card", error);
      
      next(new AppError("Failed to get card", 500));
    }
  },

  // Get all cards for a list
  getCardsByList: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { listId } = req.params;
      // const userId = req.user?.id;
      const userId = req.body.userId;

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const cards = await cardService.getCardsByList(listId, userId);

      res.status(200).json({
        status: "success",
        data: { cards },
      });
    } catch (error) {
      console.log("Failed to get cards by list", error);
      
      next(new AppError("Failed to get cards by list", 500));
    }
  },

  // Update a card
  updateCard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      // const userId = req.user?.id;
      const userId = req.body.userId;

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const card = await cardService.updateCard(id, updateData, userId);

      res.status(200).json({
        status: "success",
        data: { card },
      });
    } catch (error) {
      console.log("Failed to update card", error);
      
      next(new AppError("Failed to update card", 500));
    }
  },

  // Delete a card
  deleteCard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      // const userId = req.user?.id;
      const userId = req.body.userId;

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      await cardService.deleteCard(id, userId);

      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      console.log("Failed to delete card", error);
      
      next(new AppError("Failed to delete card", 500));
    }
  },

  // Move card to different list/position
  moveCard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { listId, position } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
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
    } catch (error) {
      next(new AppError("Failed to move card", 500));
    }
  },

  // Archive/Unarchive a card
  toggleArchive: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const card = await cardService.toggleArchive(id, userId);

      res.status(200).json({
        status: "success",
        data: { card },
      });
    } catch (error) {
      next(new AppError("Failed to toggle card archive status", 500));
    }
  },

  // Search cards
  searchCards: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query, boardId, listId } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      if (!query || typeof query !== "string") {
        return next(new AppError("Search query is required", 400));
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
    } catch (error) {
      next(new AppError("Failed to search cards", 500));
    }
  },

  // Get card activity
  getCardActivity: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const activities = await cardService.getCardActivity(id, userId);

      res.status(200).json({
        status: "success",
        data: { activities },
      });
    } catch (error) {
      next(new AppError("Failed to get card activity", 500));
    }
  },

  // Subscribe/Unsubscribe to card
  toggleSubscription: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const card = await cardService.toggleSubscription(id, userId);

      res.status(200).json({
        status: "success",
        data: { card },
      });
    } catch (error) {
      next(new AppError("Failed to toggle card subscription", 500));
    }
  },
};
