import { Router } from "express";
import labelRoutes from "./label.route.js";

const router = Router();

router.use("/labels", labelRoutes);

export default router;
