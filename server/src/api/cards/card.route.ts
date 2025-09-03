import { Router } from "express";
import { cardController } from "./card.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import { z } from "zod";

const router = Router();

// Validation schemas
const createCardSchema = z.object({
  body: z.object({
    listId: z.string().uuid(),
    title: z.string().min(1).max(255),
    description: z.string().max(1000).optional(),
    dueDate: z.string().datetime().optional(),
    startDate: z.string().datetime().optional(),
    position: z.number().min(0),
    coverImageUrl: z.string().url().optional(),
  }),
});

const updateCardSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().max(1000).optional(),
    dueDate: z.string().datetime().optional(),
    startDate: z.string().datetime().optional(),
    coverImageUrl: z.string().url().optional(),
  }),
});

const moveCardSchema = z.object({
  body: z.object({
    listId: z.string().uuid(),
    position: z.number().min(0),
  }),
});

const searchCardsSchema = z.object({
  query: z.object({
    query: z.string().min(1),
    boardId: z.string().uuid().optional(),
    listId: z.string().uuid().optional(),
  }),
});

// Card CRUD routes
router.post("/", validateRequest(createCardSchema), cardController.createCard);
router.get("/:id", cardController.getCard);
router.get("/list/:listId", cardController.getCardsByList);
router.put(
  "/:id",
  validateRequest(updateCardSchema),
  cardController.updateCard
);
router.delete("/:id", cardController.deleteCard);

// Card operations
router.patch(
  "/:id/move",
  validateRequest(moveCardSchema),
  cardController.moveCard
);
router.patch("/:id/archive", cardController.toggleArchive);
router.patch("/:id/subscribe", cardController.toggleSubscription);

// Card search and activity
router.get(
  "/search",
  validateRequest(searchCardsSchema),
  cardController.searchCards
);
router.get("/:id/activity", cardController.getCardActivity);

export default router;
