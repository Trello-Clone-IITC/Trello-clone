import { Router } from "express";
import listWatchersController from "./list-watchers.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import { UserIdParamSchema } from "@ronmordo/contracts";
import listController from "../lists/list.controller.js";

const router = Router({ mergeParams: true });

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
