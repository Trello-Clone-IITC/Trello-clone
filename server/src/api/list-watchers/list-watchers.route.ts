import { Router } from "express";
import listWatchersController from "./list-watchers.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  addListWatcherSchema,
  removeListWatcherSchema,
} from "./list-watchers.validation.js";

const router = Router();

// List watcher management
router.post(
  "/:listId/watchers",
  validateRequest(addListWatcherSchema),
  listWatchersController.addListWatcher
);
router.delete(
  "/:listId/watchers/:userId",
  validateRequest(removeListWatcherSchema),
  listWatchersController.removeListWatcher
);

export default router;
