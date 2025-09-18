import type { Request, Response, NextFunction } from "express";
import cardService from "./card.service.js";
import { AppError } from "../../utils/appError.js";
import type { ApiResponse } from "../../utils/globalTypes.js";
import type {
  ActivityLogDto,
  CardDto,
  ChecklistDto,
  CommentDto,
  CardAssigneeDto,
  LabelDto,
  CardWatcherDto,
  AttachmentDto,
} from "@ronmordo/contracts";
import {
  mapChecklistToDto,
  mapCommentToDto,
  mapCardAssigneeToDto,
  mapCardWatcherToDto,
  mapAttachmentToDto,
} from "./card.mapper.js";
import { mapActivityLogToDto } from "../activity-logs/activity-log.mapper.js";
import { userService } from "../users/user.service.js";

export const cardController = {
  // Create a new card
  createCard: async (
    req: Request,
    res: Response<ApiResponse<CardDto>>,
    next: NextFunction
  ) => {
    try {
      const { listId } = req.params;

      const userId =
        (await userService.getUserIdByRequest(req)) ||
        "96099bc0-34b7-4be5-b410-4d624cd99da5";

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const card = await cardService.createCard(req.body, listId, userId);

      res.status(201).json({
        success: true,
        data: card,
      });
    } catch (error) {
      console.error("Failed to create card", error);
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to create card", 500));
    }
  },

  // Get a single card by ID with all related data
  getCard: async (
    req: Request,
    res: Response<ApiResponse<CardDto>>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId =
        (await userService.getUserIdByRequest(req)) ||
        "96099bc0-34b7-4be5-b410-4d624cd99da5";

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const card = await cardService.getCardById(id, userId);

      res.status(200).json({
        success: true,
        data: card,
      });
    } catch (error) {
      console.log("Failed to get card", error);

      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to get card", 500));
    }
  },

  // Update a card
  updateCard: async (
    req: Request,
    res: Response<ApiResponse<CardDto>>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId =
        (await userService.getUserIdByRequest(req)) ||
        "96099bc0-34b7-4be5-b410-4d624cd99da5";

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const card = await cardService.updateCard(id, updateData, userId);

      res.status(200).json({
        success: true,
        data: card,
      });
    } catch (error) {
      console.log("Failed to update card", error);

      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to update card", 500));
    }
  },

  // Delete a card
  deleteCard: async (
    req: Request,
    res: Response<ApiResponse<{ message: string }>>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      // const userId = req.user?.id;
      const userId =
        (await userService.getUserIdByRequest(req)) ||
        "96099bc0-34b7-4be5-b410-4d624cd99da5";

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      await cardService.deleteCard(id, userId);

      res.status(200).json({
        success: true,
        message: "Card deleted successfully",
      });
    } catch (error) {
      console.log("Failed to delete card", error);

      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to delete card", 500));
    }
  },

  // Move card to different list/position
  moveCard: async (
    req: Request,
    res: Response<ApiResponse<CardDto>>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { listId, position } = req.body;
      const userId = await userService.getUserIdByRequest(req);

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
        success: true,
        data: card,
      });
    } catch (error) {
      console.log("Failed to move card errror:", error);

      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to move card", 500));
    }
  },

  // Archive/Unarchive a card
  toggleArchive: async (
    req: Request,
    res: Response<ApiResponse<CardDto>>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = await userService.getUserIdByRequest(req);

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const card = await cardService.toggleArchive(id, userId);

      res.status(200).json({
        success: true,
        data: card,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to toggle card archive status", 500));
    }
  },

  // Search cards
  searchCards: async (
    req: Request,
    res: Response<ApiResponse<CardDto[]>>,
    next: NextFunction
  ) => {
    try {
      const { query, boardId, listId } = req.query;
      const userId = await userService.getUserIdByRequest(req);

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
        success: true,
        data: cards,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to search cards", 500));
    }
  },

  // Get card activity
  getCardActivity: async (
    req: Request,
    res: Response<ApiResponse<ActivityLogDto[]>>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = await userService.getUserIdByRequest(req);

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const activities = await cardService.getCardActivity(id, userId);
      const activitiesDtoArr: ActivityLogDto[] = activities.map((activity) =>
        mapActivityLogToDto(activity)
      );

      res.status(200).json({
        success: true,
        data: activitiesDtoArr,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to get card activity", 500));
    }
  },

  // Card nested resources
  getCardChecklists: async (
    req: Request,
    res: Response<ApiResponse<ChecklistDto[]>>,
    next: NextFunction
  ) => {
    try {
      const { cardId } = req.params;
      const userId =
        (await userService.getUserIdByRequest(req)) ||
        "20c2f2d8-3de3-4b8e-8dbc-97038b9acb2b";

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const checklists = await cardService.getCardChecklists(cardId, userId);
      const checklistsDto = checklists.map(mapChecklistToDto);
      res.status(200).json({
        success: true,
        data: checklistsDto,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to get card checklists", 500));
    }
  },

  getCardComments: async (
    req: Request,
    res: Response<ApiResponse<CommentDto[]>>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId =
        (await userService.getUserIdByRequest(req)) ||
        // "3f992ec3-fd72-4153-8c8a-9575e5a61867";
        "28410fd4-660c-4d3c-b216-2e1877d93b7a";

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const comments = await cardService.getCardComments(id, userId);
      const commentsDto = comments.map(mapCommentToDto);
      res.status(200).json({
        success: true,
        data: commentsDto,
      });
    } catch (error) {
      console.log("Failed to get card comments:---", error);
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to get card comments", 500));
    }
  },

  getCardAssignees: async (
    req: Request,
    res: Response<ApiResponse<CardAssigneeDto[]>>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = await userService.getUserIdByRequest(req);

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const assignees = await cardService.getCardAssignees(id, userId);
      const assigneesDto = assignees.map(mapCardAssigneeToDto);
      res.status(200).json({
        success: true,
        data: assigneesDto,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      next(new AppError("Failed to get card assignees", 500));
    }
  },

  getCardLabels: async (
    req: Request,
    res: Response<ApiResponse<LabelDto[]>>,
    next: NextFunction
  ) => {
    try {
      const { cardId } = req.params;
      console.log(req.params);

      const userId =
        (await userService.getUserIdByRequest(req)) ||
        "3f992ec3-fd72-4153-8c8a-9575e5a61867";

      const labels = await cardService.getCardLabels(cardId, userId);
      res.status(200).json({
        success: true,
        data: labels,
      });
    } catch (error) {
      next(error);
    }
  },

  getCardWatchers: async (
    req: Request,
    res: Response<ApiResponse<CardWatcherDto[]>>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = await userService.getUserIdByRequest(req);

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const watchers = await cardService.getCardWatchers(id, userId);
      const watchersDto = watchers.map(mapCardWatcherToDto);
      res.status(200).json({
        success: true,
        data: watchersDto,
      });
    } catch (error) {
      next(new AppError("Failed to get card watchers", 500));
    }
  },

  getCardAttachments: async (
    req: Request,
    res: Response<ApiResponse<AttachmentDto[]>>,
    next: NextFunction
  ) => {
    try {
      const { cardId } = req.params;
      const userId =
        (await userService.getUserIdByRequest(req)) ||
        "3f992ec3-fd72-4153-8c8a-9575e5a61867";

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const attachments = await cardService.getCardAttachments(cardId, userId);
      const attachmentsDto = attachments.map(mapAttachmentToDto);
      res.status(200).json({
        success: true,
        data: attachmentsDto,
      });
    } catch (error) {
      next(error);
    }
  },
};
