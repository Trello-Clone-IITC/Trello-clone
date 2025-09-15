import { Router } from "express";
import { commentController } from "./comment.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  CreateCommentInputSchema,
  IdParamSchema,
  UpdateCommentSchema,
} from "@ronmordo/contracts";
import { cardController } from "../cards/card.controller.js";

const router = Router({ mergeParams: true });

router.get("/", cardController.getCardComments);

router.get(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  commentController.getComment
);

router.post(
  "/",
  validateRequest({ body: CreateCommentInputSchema }),
  commentController.createComment
);

router.patch(
  "/:id",
  validateRequest({ params: IdParamSchema, body: UpdateCommentSchema }),
  commentController.updateComment
);

router.delete(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  commentController.deleteComment
);

export default router;
