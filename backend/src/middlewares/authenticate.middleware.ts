import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import userModel, { User } from '../models/user/user.model'

interface AuthenticatedRequest extends Request {
	user?: User
}

export const authenticateUser = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		// Extract token from Authorization header
		const authHeader = req.headers.authorization
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new Error('🔍Authentication token not provided')
		}

		const token = authHeader.split(' ')[1]

		// Verify token
		const decodedToken = jwt.verify(
			token,
			process.env.JWT_SECRET_KEY || ''
		) as JwtPayload

		// Check if decoded token contains user ID
		if (!decodedToken.userID) {
			throw new Error('Invalid token')
		}

		// Fetch user from database using userID
		const user: User | null = await userModel.findById(decodedToken.userID)
		if (!user) {
			throw new Error('🔍User not found')
		}

		// Attach user object to request
		req.user = user

		next()
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({ error: 'Invalid token' })
		} else if (error instanceof jwt.TokenExpiredError) {
			return res.status(401).json({ error: 'Token expired' })
		} else {
			return res.status(401).json({ error: 'Unauthorized' })
		}
	}
}

export default authenticateUser
