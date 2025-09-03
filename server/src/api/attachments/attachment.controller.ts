import type { Request, Response } from "express";
import { attachmentService } from "./attachmentService.js";
import { AppError } from "../../utils/appError.js";
import { catchAsync } from "../../middlewares/errorHandler.js";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const attachmentController = {
  // Create a new attachment
  createAttachment: catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const { cardId, url, filename, bytes, meta } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const attachment = await attachmentService.createAttachment({
        cardId,
        url,
        filename,
        bytes: bytes ? BigInt(bytes) : undefined,
        meta,
        userId,
      });

      res.status(201).json({
        status: "success",
        data: { attachment },
      });
    }
  ),

  // Get attachment by ID
  getAttachment: catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const attachment = await attachmentService.getAttachmentById(id, userId);

      res.status(200).json({
        status: "success",
        data: { attachment },
      });
    }
  ),

  // Get all attachments for a card
  getCardAttachments: catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const { cardId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const attachments = await attachmentService.getAttachmentsByCard(
        cardId,
        userId
      );

      res.status(200).json({
        status: "success",
        data: { attachments },
      });
    }
  ),

  // Update attachment
  updateAttachment: catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const { filename, meta } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const attachment = await attachmentService.updateAttachment(
        id,
        {
          filename,
          meta,
        },
        userId
      );

      res.status(200).json({
        status: "success",
        data: { attachment },
      });
    }
  ),

  // Delete attachment
  deleteAttachment: catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      await attachmentService.deleteAttachment(id, userId);

      res.status(204).json({
        status: "success",
        data: null,
      });
    }
  ),
};
