import { Router } from "express";
import listController from "./list.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  createListSchema,
  updateListSchema,
  listIdSchema,
  updateListPositionSchema,
  archiveListSchema,
  subscribeToListSchema,
  getListWatchersSchema,
  getCardsByListSchema,
} from "./list.validation.js";

const router = Router();

// List CRUD operations
router.post(
  "/board/:boardId",
  validateRequest(createListSchema),
  listController.createList
);
router.get("/:listId", validateRequest(listIdSchema), listController.getList);
router.patch(
  "/:listId",
  validateRequest(updateListSchema),
  listController.updateList
);
router.delete(
  "/:listId",
  validateRequest(listIdSchema),
  listController.deleteList
);

// List specific operations
router.patch(
  "/:listId/position",
  validateRequest(updateListPositionSchema),
  listController.updateListPosition
);
router.patch(
  "/:listId/archive",
  validateRequest(archiveListSchema),
  listController.archiveList
);
router.patch(
  "/:listId/subscribe",
  validateRequest(subscribeToListSchema),
  listController.subscribeToList
);

// -------------------------nested routes-------------------------
router.get(
  "/:listId/watchers",
  validateRequest(getListWatchersSchema),
  listController.getListWatchers
);

router.get(
  "/:listId/cards",
  validateRequest(getCardsByListSchema),
  listController.getCardsByList
);

export default router;
