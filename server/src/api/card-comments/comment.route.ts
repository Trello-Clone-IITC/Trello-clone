import { Router } from "express";
import { commentController } from "./comment.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import * as commentValidation from "./comment.validation.js";

const router = Router();

// Card-specific comment routes
router.post("/:cardId/comments", validateRequest(commentValidation.createCommentSchema), commentController.createComment);
router.get("/:cardId/comments/:id", validateRequest(commentValidation.getCommentSchema), commentController.getComment);
router.patch(
  "/:cardId/comments/:id",
  validateRequest(commentValidation.updateCommentSchema),
  commentController.updateComment
);
router.delete("/:cardId/comments/:id", validateRequest(commentValidation.deleteCommentSchema), commentController.deleteComment);

export default router;