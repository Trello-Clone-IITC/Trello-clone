import { Router } from "express";
import { activityLogController } from "./activity-log.controller.js";
const router = Router({ mergeParams: true });
router.get("/", activityLogController.getActivityLogs);
export default router;
