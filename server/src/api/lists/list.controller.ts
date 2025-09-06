import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError.js";
import type { ApiResponse } from "../../utils/globalTypes.js";
import { listService } from "./listService.js";
import type { ListDto, ListWatcherDto } from "@ronmordo/types";
import { mapListToDto } from "./list.mapper.js";
import { mapListWatcherToDto } from "./list-watchers/list-watcher.mapper.js";

export const createList = async (
  req: Request,
  res: Response<ApiResponse<ListDto>>,
  next: NextFunction
) => {
  try {
    const { boardId } = req.params;
    const list = await listService.createList(boardId, req.body);

    const listDto: ListDto = mapListToDto(list);

    res.status(201).json({
      success: true,
      data: listDto,
    });
  } catch (error) {
    next(new AppError("Failed to create list", 500));
  }
};

export const getList = async (
  req: Request,
  res: Response<ApiResponse<ListDto>>,
  next: NextFunction
) => {
  try {
    const { listId } = req.params;
    const list = await listService.getListById(listId);

    if (!list) {
      return next(new AppError("List not found", 404));
    }

    const listDto: ListDto = mapListToDto(list);

    res.status(200).json({
      success: true,
      data: listDto,
    });
  } catch (error) {
    next(new AppError("Failed to get list", 500));
  }
};

export const updateList = async (
  req: Request,
  res: Response<ApiResponse<ListDto>>,
  next: NextFunction
) => {
  try {
    const { listId } = req.params;
    const list = await listService.updateList(listId, req.body);

    if (!list) {
      return next(new AppError("List not found", 404));
    }

    const listDto: ListDto = mapListToDto(list);

    res.status(200).json({
      success: true,
      data: listDto,
    });
  } catch (error) {
    next(new AppError("Failed to update list", 500));
  }
};

export const deleteList = async (
  req: Request,
  res: Response<ApiResponse<{ message: string }>>,
  next: NextFunction
) => {
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
  } catch (error) {
    next(new AppError("Failed to delete list", 500));
  }
};

export const getListsByBoard = async (
  req: Request,
  res: Response<ApiResponse<ListDto[]>>,
  next: NextFunction
) => {
  try {
    const { boardId } = req.params;
    const lists = await listService.getListsByBoard(boardId);
    const listsDto: ListDto[] = lists.map(mapListToDto);

    res.status(200).json({
      success: true,
      data: listsDto,
    });
  } catch (error) {
    next(new AppError("Failed to get lists by board", 500));
  }
};

export const updateListPosition = async (
  req: Request,
  res: Response<ApiResponse<ListDto>>,
  next: NextFunction
) => {
  try {
    const { listId } = req.params;
    const { position } = req.body;
    const list = await listService.updateListPosition(listId, position);

    if (!list) {
      return next(new AppError("List not found", 404));
    }

    const listDto: ListDto = mapListToDto(list);

    res.status(200).json({
      success: true,
      data: listDto,
    });
  } catch (error) {
    next(new AppError("Failed to update list position", 500));
  }
};

export const archiveList = async (
  req: Request,
  res: Response<ApiResponse<ListDto>>,
  next: NextFunction
) => {
  try {
    const { listId } = req.params;
    const { isArchived } = req.body;
    const list = await listService.archiveList(listId, isArchived);

    if (!list) {
      return next(new AppError("List not found", 404));
    }

    const listDto: ListDto = mapListToDto(list);

    res.status(200).json({
      success: true,
      data: listDto,
    });
  } catch (error) {
    next(new AppError("Failed to archive list", 500));
  }
};

export const subscribeToList = async (
  req: Request,
  res: Response<ApiResponse<ListDto>>,
  next: NextFunction
) => {
  try {
    const { listId } = req.params;
    const { subscribed } = req.body;
    const list = await listService.subscribeToList(listId, subscribed);

    if (!list) {
      return next(new AppError("List not found", 404));
    }

    const listDto: ListDto = mapListToDto(list);

    res.status(200).json({
      success: true,
      data: listDto,
    });
  } catch (error) {
    next(new AppError("Failed to update list subscription", 500));
  }
};

// List Watcher Management
export const getListWatchers = async (
  req: Request,
  res: Response<ApiResponse<ListWatcherDto[]>>,
  next: NextFunction
) => {
  try {
    const { listId } = req.params;
    const watchers = await listService.getListWatchers(listId);
    const watchersDto = watchers.map(mapListWatcherToDto);

    res.status(200).json({
      success: true,
      data: watchersDto,
    });
  } catch (error) {
    next(new AppError("Failed to get list watchers", 500));
  }
};

export const addListWatcher = async (
  req: Request,
  res: Response<ApiResponse<{ message: string }>>,
  next: NextFunction
) => {
  try {
    const { listId } = req.params;
    const { userId } = req.body;
    const added = await listService.addListWatcher(listId, userId);

    if (!added) {
      return next(new AppError("Failed to add list watcher", 400));
    }

    res.status(201).json({
      success: true,
      data: { message: "List watcher added successfully" },
    });
  } catch (error) {
    next(new AppError("Failed to add list watcher", 500));
  }
};

export const removeListWatcher = async (
  req: Request,
  res: Response<ApiResponse<{ message: string }>>,
  next: NextFunction
) => {
  try {
    const { listId, userId } = req.params;
    const removed = await listService.removeListWatcher(listId, userId);

    if (!removed) {
      return next(new AppError("List watcher not found", 404));
    }

    res.status(200).json({
      success: true,
      data: { message: "List watcher removed successfully" },
    });
  } catch (error) {
    next(new AppError("Failed to remove list watcher", 500));
  }
};
