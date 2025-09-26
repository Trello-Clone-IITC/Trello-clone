import { Router } from "express";
import { inboxController } from "./inbox.controller.js";

const router = Router();

router.get("/inbox", inboxController.getInboxCards);
// router.post("/inbox", inboxController.addCardToInbox);

export default router;
