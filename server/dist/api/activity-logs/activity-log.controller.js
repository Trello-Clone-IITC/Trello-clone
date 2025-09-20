import { activityLogService } from "./activity-log.service.js";
import { userService } from "../users/user.service.js";
import { AppError } from "../../utils/appError.js";
const getActivityLogs = async (req, res, next) => {
    try {
        const userId = await userService.getUserIdByRequest(req);
        if (!userId) {
            throw new AppError("UnAutherized", 403);
        }
        const activityLogs = await activityLogService.getGeneralActivityLogs(userId);
        return res.status(201).json({ success: true, data: activityLogs });
    }
    catch (err) {
        return next(err);
    }
};
export const activityLogController = {
    getActivityLogs,
};
