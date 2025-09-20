import { AppError } from "../../utils/appError.js";
import listWatchersService from "./list-watchers.service.js";
// import type { ListWatcherDto } from "@ronmordo/contracts";
// import { mapListWatcherToDto } from "./list-watcher.mapper.js";
// import { DUMMY_USER_ID } from "../../utils/global.dummy.js";
// import { getAuth } from "@clerk/express";
import { userService } from "../users/user.service.js";
const addListWatcher = async (req, res, next) => {
    try {
        const { listId } = req.params;
        const userId = (await userService.getUserIdByRequest(req)) ||
            "9d2287bd-c250-4f9f-87ce-cfb33fdb9d14";
        if (!userId) {
            return next(new AppError("User not authenticated", 401));
        }
        const added = await listWatchersService.addListWatcher(listId, userId);
        if (!added) {
            return next(new AppError("Failed to add list watcher", 500));
        }
        res.status(201).json({
            success: true,
            data: { message: "List watcher added successfully" },
        });
    }
    catch (error) {
        next(error);
    }
};
const removeListWatcher = async (req, res, next) => {
    try {
        const { listId, userId } = req.params;
        const authUserId = await userService.getUserIdByRequest(req);
        if (!authUserId) {
            return next(new AppError("User not authenticated", 401));
        }
        const removed = await listWatchersService.removeListWatcher(listId, userId);
        if (!removed) {
            return next(new AppError("List watcher not found", 404));
        }
        res.status(200).json({
            success: true,
            data: { message: "List watcher removed successfully" },
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError("Failed to remove list watcher", 500));
    }
};
export default {
    addListWatcher,
    removeListWatcher,
};
