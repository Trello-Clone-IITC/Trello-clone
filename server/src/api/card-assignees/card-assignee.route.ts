import { Router } from "express";
import { cardController } from "../cards/card.controller.js";
import { cardAssigneeController } from "./card-assignee.controller.js";

const router = Router({ mergeParams: true });

router.get("/", cardController.getCardAssignees);

router.post("/", cardAssigneeController.createCardAssignee);

router.delete("/:id", cardAssigneeController.deleteCardAssignee);

export default router;
