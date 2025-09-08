import type { Request, Response, NextFunction } from "express";
import attachmentService from "./attachment.service.js";
import { AppError } from "../../utils/appError.js";
import type { ApiResponse } from "../../utils/globalTypes.js";
import type { AttachmentDto } from "@ronmordo/types";
import { mapAttachmentToDto } from "./attachment.mapper.js";
import { getAuth } from "@clerk/express";
import { DUMMY_USER_ID } from "../../utils/global.dummy.js";

export const attachmentController = {
  // Create a new attachment
  createAttachment: async (req: Request, res: Response<ApiResponse<AttachmentDto>>, next: NextFunction) => {
    try {
      let { userId } = getAuth(req) || {};
      if (!userId) {
        userId = DUMMY_USER_ID; // TODO: remove this after testing
      }

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const { cardId } = req.params;
      const attachment = await attachmentService.createAttachment({
        cardId,
        ...req.body,
        userId,
      });
      const attachmentDto: AttachmentDto = mapAttachmentToDto(attachment);

      res.status(201).json({
        success: true,
        data: attachmentDto,
      });
    } catch (error) {
      console.error("Failed to create attachment", error);
      next(new AppError("Failed to create attachment", 500));
    }
  },

  // Get a single attachment by ID
  getAttachment: async (req: Request, res: Response<ApiResponse<AttachmentDto>>, next: NextFunction) => {
    try {
      const { id } = req.params;
      let { userId } = getAuth(req) || {};
      if (!userId) {
        userId = DUMMY_USER_ID; // TODO: remove this after testing
      }

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      const attachment = await attachmentService.getAttachmentById(id, userId);
      const attachmentDto: AttachmentDto = mapAttachmentToDto(attachment);

      res.status(200).json({
        success: true,
        data: attachmentDto,
      });
    } catch (error) {
      console.error("Failed to get attachment", error);
      next(new AppError("Failed to get attachment", 500));
    }
  },


  // Update an attachment
  updateAttachment: async (req: Request, res: Response<ApiResponse<AttachmentDto>>, next: NextFunction) => {
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

      const attachment = await attachmentService.updateAttachment(id, {
        ...updateData,
        bytes: updateData.bytes ? BigInt(updateData.bytes) : undefined,
      }, userId);
      const attachmentDto: AttachmentDto = mapAttachmentToDto(attachment);

      res.status(200).json({
        success: true,
        data: attachmentDto,
      });
    } catch (error) {
      console.error("Failed to update attachment", error);
      next(new AppError("Failed to update attachment", 500));
    }
  },

  // Delete an attachment
  deleteAttachment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      let { userId } = getAuth(req) || {};
      if (!userId) {
        userId = DUMMY_USER_ID; // TODO: remove this after testing
      }

      if (!userId) {
        return next(new AppError("User not authenticated", 401));
      }

      await attachmentService.deleteAttachment(id, userId);

      res.status(200).json({
        success: true,
        message: "Attachment deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete attachment", error);
      next(new AppError("Failed to delete attachment", 500));
    }
  },
};