import { Router } from "express";
import listWatchersController from "./list-watchers.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
// import {
//   addListWatcherSchema,
//   removeListWatcherSchema,
// } from "./list-watchers.validation.js";
import { ListIdParamSchema, UserIdParamSchema } from "@ronmordo/contracts";

const router = Router();

// List watcher management
// Only authenticated users can add themeselves as watchers to a list, no need to pass userId in body since we can get it from the auth token.
// router.post(
//   "/:listId/watchers",
//   validateRequest(addListWatcherSchema),
//   listWatchersController.addListWatcher
// );

router.post(
  "/:listId/watchers",
  validateRequest({ params: ListIdParamSchema }),
  listWatchersController.addListWatcher
);

router.delete(
  "/:listId/watchers/:userId",
  validateRequest({
    params: ListIdParamSchema.extend(UserIdParamSchema.shape),
  }),
  listWatchersController.removeListWatcher
);

export default router;
