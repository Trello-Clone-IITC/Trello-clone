import { AppError } from "../../utils/appError.js";
import listService from "./list.service.js";
import { mapListToDto } from "./list.mapper.js";
import { mapListWatcherToDto } from "../list-watchers/list-watcher.mapper.js";
import { userService } from "../users/user.service.js";
const createList = async (req, res, next) => {
    try {
        const { id: boardId } = req.params;
        const userId = (await userService.getUserIdByRequest(req)) ||
            "fc28efe3-ab85-4564-b0dc-b7d2b76b5897";
        const list = await listService.createList(req.body, boardId);
        const listDto = mapListToDto(list);
        res.status(201).json({
            success: true,
            data: listDto,
        });
    }
    catch (error) {
        next(error);
    }
};
const getList = async (req, res, next) => {
    try {
        const { listId } = req.params;
        const list = await listService.getListById(listId);
        if (!list) {
            return next(new AppError("List not found", 404));
        }
        const listDto = mapListToDto(list);
        res.status(200).json({
            success: true,
            data: listDto,
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError("Failed to get list", 500));
    }
};
const updateList = async (req, res, next) => {
    try {
        const { listId } = req.params;
        const userId = await userService.getUserIdByRequest(req);
        const updateData = { ...req.body };
        const list = await listService.updateList(listId, updateData);
        console.log("list", list);
        if (!list) {
            return next(new AppError("List not found", 404));
        }
        const listDto = mapListToDto(list);
        res.status(200).json({
            success: true,
            data: listDto,
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError("Failed to update list", 500));
    }
};
const deleteList = async (req, res, next) => {
    try {
        const { listId } = req.params;
        const deleted = await listService.deleteList(listId);
        if (!deleted) {
            return next(new AppError("List not found", 404));
        }
        res.status(200).json({
            success: true,
            data: { message: "List deleted successfully" },
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError("Failed to delete list", 500));
    }
};
// List Watcher Management
const getListWatchers = async (req, res, next) => {
    try {
        const { listId } = req.params;
        const watchers = await listService.getListWatchers(listId);
        const watchersDto = watchers.map(mapListWatcherToDto);
        res.status(200).json({
            success: true,
            data: watchersDto,
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError("Failed to get list watchers", 500));
    }
};
// Get all cards for a list
const getCardsByList = async (req, res, next) => {
    try {
        const { listId } = req.params;
        const userId = (await userService.getUserIdByRequest(req)) ||
            "96099bc0-34b7-4be5-b410-4d624cd99da5";
        if (!userId) {
            return next(new AppError("User not authenticated", 401));
        }
        const cards = await listService.getCardsByList(listId, userId);
        res.status(200).json({
            success: true,
            data: cards,
        });
    }
    catch (error) {
        next(error);
    }
};
export default {
    createList,
    getList,
    updateList,
    deleteList,
    getListWatchers,
    getCardsByList,
};
