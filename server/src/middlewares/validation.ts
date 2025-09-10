import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";
import { z } from "zod";

// Since ZodSchema type is deprecated I changed the schema type to z.ZodType which follows latest zod docs.
// Since Response isnt used in our functions changed the parameter name to _ following unused paramaters naming conventions.

export const validateRequest = (schema: z.ZodType) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      console.log("req.body", req.body);
      console.log("req.query", req.query);
      console.log("req.params", req.params.id);

      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      console.log("error in validation", error);

      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((err) => err.message);
        return next(new AppError(`Validation error`, 400, errorMessages));
      }
      next(error);
    }
  };
};

export const validateId = (req: Request, _: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id || id.trim() === "") {
    return next(new AppError("Invalid ID parameter", 400));
  }

  next();
};

export const validateWorkspaceData = (
  req: Request,
  _: Response,
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
  _: Response,
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
