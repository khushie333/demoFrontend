import { Request, Response } from 'express'
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'
import { bidModel } from '../models/bid/bid.model'

interface ProcessEnv {
	[key: string]: string
}

declare const process: {
	env: ProcessEnv
}
class bidController {
	//add bid by user
	static addBid = async (req: Request, res: Response): Promise<void> => {
		try {
			const { authorization } = req.headers as { authorization: string }
			const token: string = authorization.split(' ')[1]
			const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY) as {
				userID: string
			}

			const { carId } = req.params

			const { amount }: { amount: number } = req.body

			const bid = new bidModel({
				car: carId,
				user: userID,
				amount,
			})

			await bid.save()
			res.status(201).json(bid)
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: 'Internal Server Error' })
		}
	}

	//get all bids on specific car
	static getAllBids = async (req: Request, res: Response): Promise<void> => {
		try {
			const { carId } = req.params
			const bids = await bidModel.find({ car: carId })

			res.json({ bids })
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: 'Internal Server Error' })
		}
	}

	//get Max Bid on specific car
	static getMaxBid = async (req: Request, res: Response): Promise<void> => {
		try {
			const { carId } = req.params

			// Find the maximum bid for the specified car
			const maxBid = await bidModel
				.findOne({ car: carId })
				.sort({ amount: -1 })
				.limit(1)

			if (!maxBid) {
				res
					.status(404)
					.json({ message: 'No bids found for the specified car.' })
				return
			}

			res.json({ maxBidAmount: maxBid.amount })
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: 'Internal Server Error' })
		}
	}

	//get all the bids by a specific user
	static userBidHistory = async (
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

			const userIdFromToken: string = decodedToken.userID

			const { userId } = req.params

			// Check if the requested user ID matches the user ID from the token
			if (userId !== userIdFromToken) {
				res.status(403).json({ error: 'Forbidden' })
				return
			}

			const bids = await bidModel.find({ user: userId })

			res.json({ bids })
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: 'Internal Server Error' })
		}
	}
}
export default bidController
