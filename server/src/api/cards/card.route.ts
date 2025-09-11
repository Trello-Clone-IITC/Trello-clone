import { Router } from "express";
import { cardController } from "./card.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
// import * as cardValidation from "./card.validation.js";
import {
  CreateCardInputSchema,
  IdParamSchema,
  UpdateCardSchema,
} from "@ronmordo/contracts";

const router = Router({ mergeParams: true });

// Card CRUD routes
router.post(
  "/",
  validateRequest({ body: CreateCardInputSchema }),
  cardController.createCard
);
router.get(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  cardController.getCard
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
// Card activity
router.get(
  "/:id/activity",
  validateRequest({ params: IdParamSchema }),
  cardController.getCardActivity
);
// Card attachments
router.get(
  "/:id/attachments",
  validateRequest({ params: IdParamSchema }),
  cardController.getCardAttachments
);

// Card checklists
router.get(
  "/:id/checklists",
  validateRequest({ params: IdParamSchema }),
  cardController.getCardChecklists
);

// Card comments
router.get(
  "/:id/comments",
  validateRequest({ params: IdParamSchema }),
  cardController.getCardComments
);

// Card assignees
router.get(
  "/:id/assignees",
  validateRequest({ params: IdParamSchema }),
  cardController.getCardAssignees
);

// Card labels
router.get(
  "/:id/labels",
  validateRequest({ params: IdParamSchema }),
  cardController.getCardLabels
);

// Card watchers
router.get(
  "/:id/watchers",
  validateRequest({ params: IdParamSchema }),
  cardController.getCardWatchers
);

export default router;
