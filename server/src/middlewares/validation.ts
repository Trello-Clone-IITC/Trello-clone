import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id || id.trim() === "") {
    return next(new AppError("Invalid ID parameter", 400));
  }

  next();
};

export const validateWorkspaceData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, owner_id } = req.body;

  if (!name || name.trim() === "") {
    return next(new AppError("Workspace name is required", 400));
  }

  if (!owner_id || owner_id.trim() === "") {
    return next(new AppError("Owner ID is required", 400));
  }

  next();
};

export const validateBoardData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, workspace_id, owner_id } = req.body;

  if (!title || title.trim() === "") {
    return next(new AppError("Board title is required", 400));
  }

  if (!workspace_id || workspace_id.trim() === "") {
    return next(new AppError("Workspace ID is required", 400));
  }

  if (!owner_id || owner_id.trim() === "") {
    return next(new AppError("Owner ID is required", 400));
  }

  next();
};
