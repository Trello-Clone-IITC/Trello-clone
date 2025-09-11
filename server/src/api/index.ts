import { Router } from "express";
import authRouter from "./auth/auth.route.js";
import userRouter from "./users/user.route.js";
import workspaceRouter from "./workspaces/workspace.route.js";
import boardRouter from "./boards/board.route.js";
import boardMemberRouter from "./board-members/board-members.route.js";
import cardRouter from "./cards/card.route.js";
import listRouter from "./lists/list.route.js";
import listWatcherRouter from "./list-watchers/list-watchers.route.js";
import checklistRouter from "./checklists/checklist.route.js";
import checklistItemRouter from "./checklist-items/checklist-item.route.js";
import checklistItemAssigneeRouter from "./checklist-item-assignees/checklist-item-assignee.route.js";
import commentRouter from "./card-comments/comment.route.js";
import attachmentRouter from "./attachments/attachment.route.js";
import labelRouter from "./labels/label.route.js";
import cardLabelRouter from "./card-labels/card-label.route.js";
import docsRouter from "./docs/docs.route.js";
const router = Router();

// Changed resources routing to plural convenstion.
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/workspaces", workspaceRouter);
router.use("/boards", boardRouter);
router.use("/boardMembers", boardMemberRouter);
router.use("/labels", labelRouter);
router.use("/cards", cardRouter);
router.use("/attachments", attachmentRouter);
router.use("/checklists", checklistRouter);
router.use("/checklistItems", checklistItemRouter);
router.use("/checklistItemAssignees", checklistItemAssigneeRouter);
router.use("/comments", commentRouter);
router.use("/cartLabels", cardLabelRouter);
router.use("/lists", listRouter);
router.use("/listWatchers", listWatcherRouter);
router.use("/apiDocs", docsRouter);

export default router;
