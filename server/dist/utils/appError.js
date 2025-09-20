export class AppError extends Error {
    statusCode;
    isOperational;
    errors;
    constructor(message, statusCode = 500, errors) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        if (errors) {
            this.errors = errors;
        }
        Error.captureStackTrace(this, this.constructor);
    }
}
