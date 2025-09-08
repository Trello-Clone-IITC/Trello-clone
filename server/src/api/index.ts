import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import authRouter from "./auth/auth.route.js";
import userRouter from "./users/user.route.js";
import workspaceRouter from "./workspaces/workspace.route.js";
import boardRouter from "./boards/board.route.js";
import boardMembersRouter from "./board-members/board-members.route.js";
import cardRouter from "./cards/card.route.js";
import listRouter from "./lists/list.route.js";
import listWatchersRouter from "./list-watchers/list-watchers.route.js";
// import checklistRouter from "./checklists/checklist.route.js";
// import commentRouter from "./comments/comment.route.js";
// import attachmentRouter from "./attachments/attachment.route.js";
// import labelRouter from "./labels/label.route.js";

const router = Router();

// Changed resources routing to plural convenstion.
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/workspaces", workspaceRouter);
router.use("/boards", boardRouter);
router.use("/boards", boardMembersRouter);
router.use("/cards", cardRouter);
router.use("/lists", listRouter);
router.use("/lists", listWatchersRouter);
// router.use("/checklists", checklistRouter);
// router.use("/comments", commentRouter);
// router.use("/attachments", attachmentRouter);
// router.use("/labels", labelRouter);

export default router;
