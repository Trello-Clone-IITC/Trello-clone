import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";
import { z } from "zod";
import type { ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues.map((err) => err.message).join(", ");
        return next(new AppError(`Validation error: ${errorMessage}`, 400));
      }
      next(error);
    }
  };
};

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
