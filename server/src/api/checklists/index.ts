import { Router } from "express";
import checklistRoutes from "./checklist.route.js";

const router = Router();

router.use("/checklists", checklistRoutes);

export default router;
