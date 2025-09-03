import { Router } from "express";
import commentRoutes from "./comment.route.js";

const router = Router();

router.use("/comments", commentRoutes);

export default router;
