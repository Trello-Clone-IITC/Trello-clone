import { Router } from "express";
import userRouter from "./users/user.route";
import workspaceRouter from "./workspaces/workspace.route";
import boardRouter from "./boards/board.route";

const router = Router();

router.use("/users", userRouter);
router.use("/workspaces", workspaceRouter);
router.use("/boards", boardRouter);

export default router;
