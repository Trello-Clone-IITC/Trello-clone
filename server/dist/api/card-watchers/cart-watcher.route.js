import { Router } from "express";
import { cardController } from "../cards/card.controller.js";
import { cardWatcherController } from "./card-watcher.controller.js";
const router = Router({ mergeParams: true });
router.get("/", cardController.getCardWatchers);
router.post("/", cardWatcherController.createCardWatcher);
router.delete("/:id", cardWatcherController.deleteCardWatcher);
export default router;
