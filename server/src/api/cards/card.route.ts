import { Router } from "express";
import { cardController } from "./card.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import * as cardValidation from "./card.validation.js";

const router = Router();

// Card CRUD routes
router.post("/", validateRequest(cardValidation.createCardSchema), cardController.createCard);
router.get("/:id", validateRequest(cardValidation.getCardSchema), cardController.getCard);
router.patch(
  "/:id",
  validateRequest(cardValidation.updateCardSchema),
  cardController.updateCard
);
router.delete("/:id", validateRequest(cardValidation.deleteCardSchema), cardController.deleteCard);

// Card operations
router.patch(
  "/:id/move",
  validateRequest(cardValidation.moveCardSchema),
  cardController.moveCard
);
router.patch("/:id/archive", validateRequest(cardValidation.toggleArchiveSchema), cardController.toggleArchive);
router.patch("/:id/subscribe", validateRequest(cardValidation.toggleSubscriptionSchema), cardController.toggleSubscription);

// Card search and activity
router.get(
  "/search",
  validateRequest(cardValidation.searchCardsSchema),
  cardController.searchCards
);
// --------------------------nested routes--------------------------
// Card activity
router.get("/:id/activity", validateRequest(cardValidation.getCardActivitySchema), cardController.getCardActivity);
// Card attachments
router.get("/:id/attachments", validateRequest(cardValidation.getCardAttachmentsSchema), cardController.getCardAttachments);

// Card checklists
router.get("/:id/checklists", validateRequest(cardValidation.getCardChecklistsSchema), cardController.getCardChecklists);

// Card comments  
router.get("/:id/comments", validateRequest(cardValidation.getCardCommentsSchema), cardController.getCardComments);

// Card assignees
router.get("/:id/assignees", validateRequest(cardValidation.getCardAssigneesSchema), cardController.getCardAssignees);

// Card labels
router.get("/:id/labels", validateRequest(cardValidation.getCardLabelsSchema), cardController.getCardLabels);

// Card watchers
router.get("/:id/watchers", validateRequest(cardValidation.getCardWatchersSchema), cardController.getCardWatchers);


export default router;
