import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const error = new Error(`Not Found - ${req.originalUrl}`)
	res.status(404)
	next(error)
}

export const handleError = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const statusCode: number = res.statusCode === 200 ? 500 : res.statusCode
	res.status(statusCode)
	res.json({
		message: error.message,
		stack: process.env.NODE_ENV === 'production' ? '🥞' : '🔍invalid Url',
	})
}
