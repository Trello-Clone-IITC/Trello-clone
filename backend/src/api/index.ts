import { Router } from "express";
import authRouter from "./auth/auth.route.js";
import userRouter from "./users/user.route.js";
import workspaceRouter from "./workspaces/workspace.route.js";
import boardRouter from "./boards/board.route.js";
import cardRouter from "./cards/card.route.js";
import listRouter from "./lists/list.route.js";
import checklistRouter from "./checklists/checklist.route.js";
import docsRouter from "./docs/docs.route.js";
import inboxRouter from "./inboxes/inbox.route.js";
import searchRouter from "./search/search.route.js";

const router = Router();

// Changed resources routing to plural convenstion.
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/inbox", inboxRouter);
router.use("/workspaces", workspaceRouter);
router.use("/boards", boardRouter);
router.use("/cards", cardRouter);
router.use("/checklists", checklistRouter);
router.use("/lists", listRouter);
router.use("search", searchRouter);
router.use("/apiDocs", docsRouter);

export default router;
