import type { Request, Response, NextFunction } from "express";
import { cardService } from "./cardService.js";
import { AppError } from "../../utils/appError.js";
import type{ ApiResponse } from "../../utils/globalTypes.js";
import type{ ActivityLogDto, CardDto } from "@ronmordo/types";
import { mapCardToDto } from "./card.mapper.js";
import { mapActivityLogToDto } from "../activity-logs/activity-log.mapper.js";
import { getAuth } from "@clerk/express";


export const cardController = {
  // Create a new card
  createCard: async (req: Request, res: Response<ApiResponse<CardDto>>, next: NextFunction) => {
    try {
      const {
 
        userId,
      } = req.body;
      // const userId = req.user?.id;

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const card = await cardService.createCard({...req.body, createdBy: userId});
      const cardDto: CardDto = mapCardToDto(card);

      res.status(201).json({
        success: true,
        data: cardDto,
      });
    } catch (error) {
      console.error("Failed to create card", error);
      next(new AppError("Failed to create card", 500));
    }
  },

  // Get a single card by ID with all related data
  getCard: async (req: Request, res: Response<ApiResponse<CardDto>>, next: NextFunction) => {
    try {
      const { id } = req.params;
      let { userId } = getAuth(req) || {};
      if (!userId) {
        userId = req.body.userId;
      }

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const card = await cardService.getCardById(id, userId);
      const cardDto: CardDto = mapCardToDto(card);

      res.status(200).json({
        success: true,
        data: cardDto,
      });
    } catch (error) {
      console.log("Failed to get card", error);
      
      next(new AppError("Failed to get card", 500));
    }
  },

  // Get all cards for a list
  getCardsByList: async (req: Request, res: Response<ApiResponse<CardDto[]>>, next: NextFunction) => {
    try {
      const { listId } = req.params;
      // const userId = req.user?.id;
      const userId = req.body.userId;

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const cards = await cardService.getCardsByList(listId, userId);
      const cardsDtoArr: CardDto[] = cards.map(card => mapCardToDto(card));

      res.status(200).json({
        success: true,
        data: cardsDtoArr,
      });
    } catch (error) {
      console.log("Failed to get cards by list", error);
      
      next(new AppError("Failed to get cards by list", 500));
    }
  },

  // Update a card
  updateCard: async (req: Request, res: Response<ApiResponse<CardDto>>, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      // const userId = req.user?.id;
      const userId = req.body.userId;

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const card = await cardService.updateCard(id, updateData, userId);
      const cardDto: CardDto = mapCardToDto(card);

      res.status(200).json({
        success: true,
        data: cardDto,
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
        success: true,
        data: null,
      });
    } catch (error) {
      console.log("Failed to delete card", error);
      
      next(new AppError("Failed to delete card", 500));
    }
  },

  // Move card to different list/position
  moveCard: async (req: Request, res: Response<ApiResponse<CardDto>>, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { listId, position } = req.body;
      const userId = req.body.userId;

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const card = await cardService.moveCard(
        id,
        listId,
        parseFloat(position),
        userId
      );
      const cardDto: CardDto = mapCardToDto(card);

      res.status(200).json({
        success: true,
        data: cardDto,
      });
    } catch (error) {
      next(new AppError("Failed to move card", 500));
    }
  },

  // Archive/Unarchive a card
  toggleArchive: async (req: Request, res: Response<ApiResponse<CardDto>>, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.body.userId;

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const card = await cardService.toggleArchive(id, userId);
      const cardDto: CardDto = mapCardToDto(card);

      res.status(200).json({
        success: true,
        data: cardDto,
      });
    } catch (error) {
      next(new AppError("Failed to toggle card archive status", 500));
    }
  },

  // Search cards
  searchCards: async (req: Request, res: Response<ApiResponse<CardDto[]>>, next: NextFunction) => {
    try {
      const { query, boardId, listId } = req.query;
      const userId = req.body.userId;

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
      const cardDtos: CardDto[] = cards.map(card => mapCardToDto(card));

      res.status(200).json({
        success: true,
        data: cardDtos,
      });
    } catch (error) {
      next(new AppError("Failed to search cards", 500));
    }
  },

  // Get card activity
  getCardActivity: async (req: Request, res: Response<ApiResponse<ActivityLogDto[]>>, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.body.userId;

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const activities = await cardService.getCardActivity(id, userId);
      const activitiesDtoArr: ActivityLogDto[] = activities.map(activity => mapActivityLogToDto(activity));

      res.status(200).json({
        success: true,
        data: activitiesDtoArr,
      });
    } catch (error) {
      next(new AppError("Failed to get card activity", 500));
    }
  },

  // Subscribe/Unsubscribe to card
  toggleSubscription: async (req: Request, res: Response<ApiResponse<CardDto>>, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.body.userId;

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const card = await cardService.toggleSubscription(id, userId);
      const cardDto: CardDto = mapCardToDto(card);

      res.status(200).json({
        success: true,
        data: cardDto,
      });
    } catch (error) {
      next(new AppError("Failed to toggle card subscription", 500));
    }
  },
};
