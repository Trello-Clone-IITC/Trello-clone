import { Router } from "express";
import authRouter from "./auth/auth.route.js";
// import userRouter from "./users/user.route.js";
// import workspaceRouter from "./workspaces/workspace.route.js";
import boardRouter from "./boards/board.route.js";
import cardRouter from "./cards/card.route.js";
// import checklistRouter from "./checklists/checklist.route.js";
// import commentRouter from "./comments/comment.route.js";
// import attachmentRouter from "./attachments/attachment.route.js";
// import labelRouter from "./labels/label.route.js";

const router = Router();

router.use("/auth", authRouter);
// router.use("/users", userRouter);
// router.use("/workspaces", workspaceRouter);
router.use("/board", boardRouter);
router.use("/card", cardRouter);
// router.use("/checklists", checklistRouter);
// router.use("/comments", commentRouter);
// router.use("/attachments", attachmentRouter);
// router.use("/labels", labelRouter);

export default router;
