// bookmarkController.ts
import { Request, Response } from 'express'
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'

import bookmarkModel, { Bookmark } from '../models/bookmarks/bookmark.model'

interface ProcessEnv {
	[key: string]: string
}

declare const process: {
	env: ProcessEnv
}

//create bookmark
export const bookmarkCar = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { authorization } = req.headers
		const token = authorization?.split(' ')[1]

		if (!token) {
			res.status(401).json({ error: 'Unauthorized' })
			return
		}

		const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY)

		// Extract user ID from decoded token
		const userId: string = decodedToken.userID
		const { carId } = req.params

		// Check if the bookmark already exists
		const existingBookmark: Bookmark | null = await bookmarkModel.findOne({
			user: userId,
			car: carId,
		})

		if (existingBookmark) {
			res.status(400).json({ message: 'Bookmark already exists' })
			return
		}

		const bookmark: Bookmark = new bookmarkModel({
			user: userId,
			car: carId,
		})

		await bookmark.save()
		res.status(201).json(bookmark)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

//get all bookmark
export const getBookmarkedCarsByUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { userId } = req.params

		// Find all bookmarks for the specified user
		const bookmarks: Bookmark[] = await bookmarkModel.find({ user: userId })

		res.json({ bookmarks })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

//remove bookmark
export const removeBookmark = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { authorization } = req.headers
		const token = authorization?.split(' ')[1]

		if (!token) {
			res.status(401).json({ error: 'Unauthorized' })
			return
		}

		const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY)

		// Extract user ID from decoded token
		const userId: string = decodedToken.userID
		const { carId } = req.params

		// Remove the bookmark for the specified user and car
		await bookmarkModel.deleteOne({ user: userId, car: carId })

		res.json({ message: 'Bookmark removed successfully' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}
