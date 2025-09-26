import type { Request, Response, NextFunction } from "express";
import cardService from "./card.service.js";
import { AppError } from "../../utils/appError.js";
import type { ApiResponse } from "../../utils/globalTypes.js";
import type {
  CardDto,
  ChecklistDto,
  CardAssigneeDto,
  LabelDto,
  CardWatcherDto,
  AttachmentDto,
  ActivityLogFullDto,
  CommentWithUserDto,
} from "@ronmordo/contracts";
import {
  mapCardAssigneeToDto,
  mapCardWatcherToDto,
  mapAttachmentToDto,
} from "./card.mapper.js";
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
      const { id, listId } = req.params;
      const userId =
        (await userService.getUserIdByRequest(req)) ||
        "96099bc0-34b7-4be5-b410-4d624cd99da5";

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const card = await cardService.getCardById(id, userId, listId);

      res.status(200).json({
        success: true,
        data: card,
      });
    } catch (error) {
      next(error);
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
      next(error);
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
      next(error);
    }
  },

  // Move card to different list/position
  // moveCard: async (
  //   req: Request,
  //   res: Response<ApiResponse<CardDto>>,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const { id } = req.params;
  //     const { listId, position } = req.body;
  //     const userId = await userService.getUserIdByRequest(req);

  //     if (!userId) {
  //       return next(new AppError("User not authenticated", 401));
  //     }

  //     const card = await cardService.moveCard(
  //       id,
  //       listId,
  //       parseFloat(position),
  //       userId
  //     );

  //     res.status(200).json({
  //       success: true,
  //       data: card,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  // Archive/Unarchive a card
  // toggleArchive: async (
  //   req: Request,
  //   res: Response<ApiResponse<CardDto>>,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const { id } = req.params;
  //     const userId = await userService.getUserIdByRequest(req);

  //     if (!userId) {
  //       return next(new AppError("User not authenticated", 401));
  //     }

  //     const card = await cardService.toggleArchive(id, userId);

  //     res.status(200).json({
  //       success: true,
  //       data: card,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  // Search cards
  // searchCards: async (
  //   req: Request,
  //   res: Response<ApiResponse<CardDto[]>>,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const { query, boardId, listId } = req.query;
  //     const userId = await userService.getUserIdByRequest(req);

  //     if (!userId) {
  //       return next(new AppError("User not authenticated", 401));
  //     }

  //     if (!query || typeof query !== "string") {
  //       return next(new AppError("Search query is required", 400));
  //     }

  //     const cards = await cardService.searchCards(
  //       query,
  //       {
  //         boardId: boardId as string,
  //         listId: listId as string,
  //       },
  //       userId
  //     );

  //     res.status(200).json({
  //       success: true,
  //       data: cards,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  // Get card activity
  getCardActivity: async (
    req: Request,
    res: Response<ApiResponse<ActivityLogFullDto[]>>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = await userService.getUserIdByRequest(req);

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const activities = await cardService.getCardActivity(id, userId);

      res.status(200).json({
        success: true,
        data: activities,
      });
    } catch (error) {
      next(error);
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

      res.status(200).json({
        success: true,
        data: checklists,
      });
    } catch (error) {
      next(error);
    }
  },

  getCardComments: async (
    req: Request,
    res: Response<ApiResponse<CommentWithUserDto[]>>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId =
        (await userService.getUserIdByRequest(req)) ||
        "3f992ec3-fd72-4153-8c8a-9575e5a61867";

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const comments = await cardService.getCardComments(id, userId);
      res.status(200).json({
        success: true,
        data: comments,
      });
    } catch (error) {
      next(error);
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
      next(error);
    }
  },

  getCardLabels: async (
    req: Request,
    res: Response<ApiResponse<LabelDto[]>>,
    next: NextFunction
  ) => {
    try {
      const { cardId } = req.params;

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
      next(error);
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
