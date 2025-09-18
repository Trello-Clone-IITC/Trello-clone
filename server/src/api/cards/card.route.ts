import { Router } from "express";
import { cardController } from "./card.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  CardIdParamSchema,
  CreateCardInputSchema,
  IdParamSchema,
  UpdateCardSchema,
} from "@ronmordo/contracts";
import checklistsRouter from "../checklists/checklist.route.js";
import listController from "../lists/list.controller.js";
import cardLabelsRouter from "../card-labels/card-label.route.js";
import commentsRouter from "../card-comments/comment.route.js";
import attachmentsRouter from "../attachments/attachment.route.js";

const router = Router({ mergeParams: true });

// Card CRUD routes
router.get("/", listController.getCardsByList);

router.get(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  cardController.getCard
);

router.post(
  "/",
  validateRequest({ body: CreateCardInputSchema }),
  cardController.createCard
);

router.patch(
  "/:id",
  validateRequest({ params: IdParamSchema, body: UpdateCardSchema }),
  cardController.updateCard
);

router.delete(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  cardController.deleteCard
);

// --------------------------nested routes--------------------------

router.use(
  "/:cardId/checklists",
  validateRequest({ params: CardIdParamSchema }),
  checklistsRouter
);

router.use(
  "/:cardId/labels",
  validateRequest({ params: CardIdParamSchema }),
  cardLabelsRouter
);

router.use(
  "/:id/comments",
  validateRequest({ params: IdParamSchema }),
  commentsRouter
);

router.use(
  "/:cardId/attachments",
  validateRequest({ params: CardIdParamSchema }),
  attachmentsRouter
);

export default router;
