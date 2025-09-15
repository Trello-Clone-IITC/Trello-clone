import { Router } from "express";
import listWatchersController from "./list-watchers.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
// import {
//   addListWatcherSchema,
//   removeListWatcherSchema,
// } from "./list-watchers.validation.js";
import { UserIdParamSchema } from "@ronmordo/contracts";
import listController from "../lists/list.controller.js";

const router = Router({ mergeParams: true });

// List watcher management
// Only authenticated users can add themeselves as watchers to a list, no need to pass userId in body since we can get it from the auth token.
// router.post(
//   "/:listId/watchers",
//   validateRequest(addListWatcherSchema),
//   listWatchersController.addListWatcher
// );

router.get("/", listController.getListWatchers);

router.post("/", listWatchersController.addListWatcher);

router.delete(
  "/:userId",
  validateRequest({
    params: UserIdParamSchema,
  }),
  listWatchersController.removeListWatcher
);

export default router;
