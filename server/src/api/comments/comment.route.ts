import { Router } from "express";
import { commentController } from "./comment.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import { z } from "zod";

const router = Router();

// Validation schemas
const createCommentSchema = z.object({
  body: z.object({
    cardId: z.string().uuid(),
    text: z.string().min(1).max(1000),
  }),
});

const updateCommentSchema = z.object({
  body: z.object({
    text: z.string().min(1).max(1000),
  }),
});

// Comment CRUD routes
router.post(
  "/",
  validateRequest(createCommentSchema),
  commentController.createComment
);
router.get("/:id", commentController.getComment);
router.get("/card/:cardId", commentController.getCardComments);
router.put(
  "/:id",
  validateRequest(updateCommentSchema),
  commentController.updateComment
);
router.delete("/:id", commentController.deleteComment);

export default router;
