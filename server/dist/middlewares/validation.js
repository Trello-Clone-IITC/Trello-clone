import { AppError } from "../utils/appError.js";
import { z } from "zod";
// Since ZodSchema type is deprecated I changed the schema type to z.ZodType which follows latest zod docs.
// Since Response isnt used in our functions changed the parameter name to _ following unused paramaters naming conventions.
export const validateRequest = (fields) => {
    const { body = z.object({}).optional(), params = z.object({}).optional(), query = z.object({}).optional(), } = fields;
    return async (req, _, next) => {
        try {
            // console.log("req.body", req.body);
            // console.log("req.query", req.query);
            // console.log("req.params", req.params);
            await Promise.all([
                body.parseAsync(req.body),
                params.parseAsync(req.params),
                query.parseAsync(req.query),
            ]);
            next();
        }
        catch (error) {
            console.log("error in validation", error);
            if (error instanceof z.ZodError) {
                const errorMessages = error.issues.map((err) => err.message);
                return next(new AppError(`Validation error`, 400, errorMessages));
            }
            next(error);
        }
    };
};
export const validateId = (req, _, next) => {
    const { id } = req.params;
    if (!id || id.trim() === "") {
        return next(new AppError("Invalid ID parameter", 400));
    }
    next();
};
export const validateWorkspaceData = (req, _, next) => {
    const { name, owner_id } = req.body;
    if (!name || name.trim() === "") {
        return next(new AppError("Workspace name is required", 400));
    }
    if (!owner_id || owner_id.trim() === "") {
        return next(new AppError("Owner ID is required", 400));
    }
    next();
};
export const validateBoardData = (req, _, next) => {
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
