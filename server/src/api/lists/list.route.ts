import { Router } from "express";
import {
  createList,
  getList,
  updateList,
  deleteList,
  getListsByBoard,
  updateListPosition,
  archiveList,
  subscribeToList,
  getListWatchers,
  addListWatcher,
  removeListWatcher,
} from "./list.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  createListSchema,
  updateListSchema,
  listIdSchema,
  boardIdSchema,
  updateListPositionSchema,
  archiveListSchema,
  subscribeToListSchema,
  getListWatchersSchema,
  addListWatcherSchema,
  removeListWatcherSchema,
} from "./list.validation.js";

const router = Router();

// List CRUD operations
router.post("/board/:boardId", validateRequest(createListSchema), createList);
router.get("/board/:boardId", validateRequest(boardIdSchema), getListsByBoard);
router.get("/:listId", validateRequest(listIdSchema), getList);
router.put("/:listId", validateRequest(updateListSchema), updateList);
router.delete("/:listId", validateRequest(listIdSchema), deleteList);

// List specific operations
router.put(
  "/:listId/position",
  validateRequest(updateListPositionSchema),
  updateListPosition
);
router.put("/:listId/archive", validateRequest(archiveListSchema), archiveList);
router.put(
  "/:listId/subscribe",
  validateRequest(subscribeToListSchema),
  subscribeToList
);

// List watcher management
router.get(
  "/:listId/watchers",
  validateRequest(getListWatchersSchema),
  getListWatchers
);
router.post(
  "/:listId/watchers",
  validateRequest(addListWatcherSchema),
  addListWatcher
);
router.delete(
  "/:listId/watchers/:userId",
  validateRequest(removeListWatcherSchema),
  removeListWatcher
);

export default router;
