import { Router } from "express";
// import userRouter from "./users/user.route.js";
// import workspaceRouter from "./workspaces/workspace.route.js";
// import boardRouter from "./boards/board.route.js";
import cardRouter from "./cards/index.js";

const router = Router();

// router.use("/users", userRouter);
// router.use("/workspaces", workspaceRouter);
// router.use("/boards", boardRouter);
router.use("/cards", cardRouter);

export default router;
