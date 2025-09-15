import { Router } from "express";
import { cardController } from "./card.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
// import * as cardValidation from "./card.validation.js";
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

// Card operations
// router.patch(
//   "/:id/move",
//   validateRequest(cardValidation.moveCardSchema),
//   cardController.moveCard
// );
// router.patch("/:id/archive", validateRequest(cardValidation.toggleArchiveSchema), cardController.toggleArchive);
// router.patch("/:id/subscribe", validateRequest(cardValidation.toggleSubscriptionSchema), cardController.toggleSubscription);

// Card search and activity ------> TODO implement search schema
// router.get(
//   "/search",
//   validateRequest(cardValidation.searchCardsSchema),
//   cardController.searchCards
// );
// --------------------------nested routes--------------------------
// Card activity -------> move to activity module
// router.get(
//   "/:id/activity",
//   validateRequest({ params: IdParamSchema }),
//   cardController.getCardActivity
// );

// Card attachments -----> moved to attachments module
// router.get(
//   "/:id/attachments",
//   validateRequest({ params: IdParamSchema }),
//   cardController.getCardAttachments
// );

// Card checklists -------> moved to checklists module
// router.get(
//   "/:id/checklists",
//   validateRequest({ params: IdParamSchema }),
//   cardController.getCardChecklists
// );

// Card comments -------> moved to card comments module
// router.get(
//   "/:id/comments",
//   validateRequest({ params: IdParamSchema }),
//   cardController.getCardComments
// );

// Card assignees -------> move to card assignees module
// router.get(
//   "/:id/assignees",
//   validateRequest({ params: IdParamSchema }),
//   cardController.getCardAssignees
// );

// Card labels -------> moved to cardLabels module
// router.get(
//   "/:id/labels",
//   validateRequest({ params: IdParamSchema }),
//   cardController.getCardLabels
// );

// Card watchers -------> add to card watchers module
// router.get(
//   "/:id/watchers",
//   validateRequest({ params: IdParamSchema }),
//   cardController.getCardWatchers
// );

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
