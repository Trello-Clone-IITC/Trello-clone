import { Router } from "express";
import { commentController } from "./comment.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  CreateCommentRequestSchema,
  UpdateCommentRequestSchema,
  GetByIdRequestSchema,
} from "@ronmordo/types";

const router = Router();

// Card-specific comment routes
router.post(
  "/:id/comments",
  validateRequest(CreateCommentRequestSchema),
  commentController.createComment
);
router.get(
  "/:cardId/comments/:id",
  validateRequest(GetByIdRequestSchema),
  commentController.getComment
);
router.patch(
  "/:cardId/comments/:id",
  validateRequest(UpdateCommentRequestSchema),
  commentController.updateComment
);
router.delete(
  "/:cardId/comments/:id",
  validateRequest(GetByIdRequestSchema),
  commentController.deleteComment
);

export default router;
