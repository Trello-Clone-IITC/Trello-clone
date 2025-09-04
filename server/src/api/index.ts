import { Router } from "express";
import authRouter from "./auth/auth.route.js";
// import userRouter from "./users/user.route.js";
import workspaceRouter from "./workspaces/workspace.route.js";
import boardRouter from "./boards/board.route.js";
import cardRouter from "./cards/card.route.js";
// import checklistRouter from "./checklists/checklist.route.js";
// import commentRouter from "./comments/comment.route.js";
// import attachmentRouter from "./attachments/attachment.route.js";
// import labelRouter from "./labels/label.route.js";

const router = Router();

router.use("/auth", authRouter);
// router.use("/user", userRouter);
router.use("/workspace", workspaceRouter);
router.use("/board", boardRouter);
router.use("/card", cardRouter);
// router.use("/checklist", checklistRouter);
// router.use("/comment", commentRouter);
// router.use("/attachment", attachmentRouter);
// router.use("/label", labelRouter);

export default router;
