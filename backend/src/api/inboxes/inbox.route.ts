import { Router } from "express";
import { inboxController } from "./inbox.controller.js";

const router = Router();

router.get("/", inboxController.getInboxCards);

export default router;
