import { Router } from "express";
import attachmentRoutes from "./attachment.route.js";

const router = Router();

router.use("/attachments", attachmentRoutes);

export default router;
