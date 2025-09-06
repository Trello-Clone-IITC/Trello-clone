import { Router } from "express";
import { cardController } from "./card.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import * as cardValidation from "./card.validation.js";

const router = Router();

// Card CRUD routes
router.post("/", validateRequest(cardValidation.createCardSchema), cardController.createCard);
router.get("/:id", validateRequest(cardValidation.getCardSchema), cardController.getCard);
router.get("/list/:listId", validateRequest(cardValidation.getCardsByListSchema), cardController.getCardsByList);
router.put(
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
router.get("/:id/activity", validateRequest(cardValidation.getCardActivitySchema), cardController.getCardActivity);

export default router;
