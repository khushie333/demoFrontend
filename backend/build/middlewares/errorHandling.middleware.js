"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.errorHandler = void 0;
const errorHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
exports.errorHandler = errorHandler;
const handleError = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : '🔍invalid Url',
    });
};
exports.handleError = handleError;
