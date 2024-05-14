import { Request, Response } from 'express'
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'
import { bidModel } from '../models/bid/bid.model'
import carModel from '../models/car/car.model'
import notificationmodel from '../models/notification/noti.model'
import { Server as SocketIOServer } from 'socket.io'
import { io } from '../server'
import UserModel from '../models/user/user.model'
import transporter from '../config/emailConf'
import userModel, { User } from '../models/user/user.model'

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
			console.log(token)
			if (token === 'undefined') {
				res.status(500).send({ error: 'Not signed in' })
				console.log('Not signed in')
				return
			}
			if (token.length !== 0) {
				const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY) as {
					userID: string
				}

				const { carId } = req.params
				if (carId) {
					const car = await carModel.findById(carId)

					const baseamount = car?.baseAmount
					const { amount }: { amount: number } = req.body

					if (baseamount && amount > baseamount) {
						const bid = new bidModel({
							car: carId,
							user: userID,
							amount,
						})

						await bid.save()

						//io.emit('newBid', { bid: amount, carId, userID })
						io.emit('bidReceived', {
							message: `New bid of ${amount} placed on your car ${car.brand} ${car.Model} by user ${userID}`,
							bidAmount: amount,
							carId,
							bidderId: userID,
						})

						await notificationmodel.create({
							car: carId,
							user: car.user,
							type: 'NewBid',
							message: `New bid of ${amount} on your car ${car.brand} ${car.Model}`,
							isRead: false,
						})

						res.status(201).json(bid)
					} else {
						res
							.status(500)
							.send({ error: 'bid amount should be greater than baseAmount' })
						console.log('baseamount error')
					}
				} else {
					console.log('error')
				}
			} else {
				res.send('Please LogIn first')
				console.log('token not provided')
			}
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: error })
			console.log(error)
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

	//Delete a bid
	static deleteBid = async (req: Request, res: Response): Promise<void> => {
		try {
			const { authorization } = req.headers as { authorization: string }
			const token: string = authorization.split(' ')[1]

			if (token.length !== 0) {
				const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY) as {
					userID: string
				}
				const { bidId } = req.params

				// Delete the bid
				const bid = await bidModel.findById(bidId)
				if (bid?.user.toString() === userID) {
					const deleteBid = await bidModel.findByIdAndDelete(bidId)

					if (!deleteBid) {
						res.status(404).json({ error: 'Bid not found' })
						return
					}
				}

				res.json({ message: 'Bid deleted successfully' })
			} else {
				res.send('Please LogIn first')
				console.log('token not provided')
			}
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
				// Respond with a custom status (200 OK) and a message indicating no bids found
				res.status(200).json({
					maxBidAmount: null,
					message: 'No bids found for the specified car.',
				})
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

	//Finalize the bid by sending an email
	static bidFinalization = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const { bidAmount, brand, Model, email, ownerEmail, ownerPhone, carID } =
				req.body

			if (email) {
				const user: User | null = await userModel.findOne({ email: email })
				const car = await carModel.findById(carID)
				if (user && car) {
					const secret: string = user._id + process.env.JWT_SECRET_KEY
					const token: string = jwt.sign({ userID: user._id }, secret, {
						expiresIn: 86400,
					})

					const link: string = `http://localhost:3000/CheckoutPage/${
						user._id
					}/${token}?brand=${encodeURIComponent(
						brand
					)}&model=${encodeURIComponent(Model)}&amount=${encodeURIComponent(
						bidAmount
					)}`

					// Send email
					const info = await transporter.sendMail({
						from: process.env.EMAIL_FROM,
						to: user.email,
						subject: 'Bid has accepted',
						html: `
                <h2>Bid Acceptance Notification</h2>
                <p>Your bid of ${bidAmount} has been accepted for the following car:</p>
                <ul>
                  <li>Brand: ${brand}</li>
                  <li>Model: ${Model}</li>

                </ul>
                <br/>
                <p>Contact details of the owner:</p>
                  <ul>
                  <li>Contact: ${ownerEmail}</li>
                  <li>Email: ${ownerPhone}</li>
                  <a href="${link}"> Click here for checkout </a>
                </ul>
                <p>Congrats! Thank you for your bid!</p>
              `,
					})
					car.deleted = true
					await car.save()

					res.status(201).send({
						status: 'success',
						message: 'Please check your email',
						info: info,
					})
				} else {
					res.send({ status: 'failed', message: 'Email does not exist' })
				}
			} else {
				res.send({ status: 'failed', message: 'Email is required' })
			}
		} catch (error) {
			console.error(error)
			res.status(500).send({
				status: 'failed',
				message: 'Unable to send email',
			})
		}
	}
}
export default bidController
