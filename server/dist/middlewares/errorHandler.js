import { AppError } from "../utils/appError.js";
export const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
export const globalErrorHandler = (err, _req, res, _next) => {
    if (err instanceof Error) {
        console.log("Error:", err);
        return res.status(err instanceof AppError ? err.statusCode : 500).json({
            success: false,
            data: {
                message: err.message,
                errors: err instanceof AppError ? err.errors ?? [] : [],
            },
        });
    }
    console.error("Unhandled Error:", err);
    return res.status(500).json({
        success: false,
        data: {
            message: "Something went wrong. Please try again later.",
            errors: [],
        },
    });
};
