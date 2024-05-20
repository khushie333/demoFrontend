import { Request, Response } from 'express'
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'
import multer, { Multer } from 'multer'
import { RequestHandler } from 'express'
//import { extname } from 'path'
import { ParamsDictionary } from 'express-serve-static-core'
import { ParsedQs } from 'qs'
import { io } from '../server'
import { carModel } from '../models/car/car.model'
//import { upload } from '../middlewares/multer.middleware'
import notificationmodel, {
	notification,
} from '../models/notification/noti.model'
import UserModel from '../models/user/user.model'
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/') // Destination directory for uploaded files
	},
	filename: (req, file, callback) => {
		callback(null, file.originalname)
	},
})

export const upload: RequestHandler<
	ParamsDictionary,
	any,
	any,
	ParsedQs,
	Record<string, any>
> = multer({ storage }).array('images[]', 5)

interface ProcessEnv {
	[key: string]: string
}

declare const process: {
	env: ProcessEnv
}

class CarController {
	//createCar

	static createCar = async (req: Request, res: Response): Promise<void> => {
		try {
			console.log('call')

			const authorization = req.headers.authorization

			if (!authorization) {
				res.status(401).send({ error: 'Unauthorized' })
				return
			}

			const token = authorization.split(' ')[1]

			if (!token) {
				res.status(401).send({ error: 'Unauthorized' })
				return
			}
			const decodedToken = jwt.verify(
				token,
				process.env.JWT_SECRET_KEY
			) as Jwt & JwtPayload

			const userID = decodedToken.userID as string

			const {
				brand,
				Model,
				desc,
				owner,
				baseAmount,
				bidStartDate,
				bidEndDate,
			} = req.body
			console.log(req.body)

			try {
				const startDate = new Date(bidStartDate)
				const endDate = new Date(bidEndDate)

				if (endDate <= startDate) {
					res
						.status(400)
						.json({ error: 'Bid end date must be after bid start date.' })
					return
				}
			} catch (error) {
				console.error(error)
				res.status(500).json({ error: 'Internal Server Error' })
			}
			const files = req.files as Express.Multer.File[]
			console.log(files)
			const images = files.map((file) => file.originalname)

			const carData = new carModel({
				user: userID,
				brand,
				Model,
				desc,
				owner,
				images,
				baseAmount,
				bidStartDate,
				bidEndDate,
			})

			const car = new carModel(carData)
			const result = await car.save()
			io.emit('NewCar', {
				message: `New car ${car.brand} ${car.Model} added by user ${userID}`,
				carId: result._id, // Use the saved car's ID
				userId: userID,
			})
			const adminUser = await UserModel.findOne({ isAdmin: true })
			if (!adminUser) {
				throw new Error('Admin user not found')
			}
			// Create a notification for the admin
			await notificationmodel.create({
				car: result._id, // Use the saved car's ID
				user: adminUser._id,
				type: 'NewCar',
				message: `New car ${car.brand} ${car.Model} added by user ${userID}`,
				isRead: false,
			})
			res.status(201).send(result)
		} catch (error) {
			console.error(error)
			res.status(500).send({ error: 'Internal Server Error' })
		}
	}

	//get All the cars
	static getAllCars = async (req: Request, res: Response): Promise<void> => {
		try {
			const currentDate = new Date()
			const result = await carModel.find({
				isApproved: true,
				bidEndDate: { $gt: currentDate },
				deleted: false,
			})
			res.send(result)
		} catch (error) {
			console.error(error)
			res.status(500).send({ error: 'Internal Server Error' })
		}
	}

	//get Single car by id
	static getSingleCarById = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const result = await carModel.findById(req.params.id)
			if (!result) {
				res.status(404).send({ message: 'Car not found' })
				return
			}
			res.send(result)
		} catch (error) {
			console.error(error)
			res.status(500).send({ error: 'Internal Server Error' })
		}
	}

	static getSingleCarByIdForBid = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const result = await carModel.find({
				_id: req.params.id,
				deleted: false,
			})
			console.log('result:', result)
			if (!result) {
				return
			}

			res.send(result)
		} catch (error) {
			console.error(error)
			res.status(500).send({ error: 'Internal Server Error' })
		}
	}

	//update car by id
	static updateCarById = async (req: Request, res: Response): Promise<void> => {
		try {
			const authorization = req.headers.authorization
			if (!authorization) {
				res.status(401).json({ message: 'Unauthorized user' })
				return
			}

			const token = authorization.split(' ')[1]
			if (!token) {
				res.status(401).json({ message: 'Unauthorized user' })
				return
			}

			const decodedToken = jwt.verify(
				token,
				process.env.JWT_SECRET_KEY
			) as Jwt & JwtPayload
			const userID = decodedToken.userID as string
			//console.log(userID)

			const car = await carModel.findById(req.params.id)
			if (!car) {
				res.status(404).json({ message: 'Car not found' })
				return
			}
			//console.log(String(car.user))

			if (String(car.user) !== userID) {
				res.status(403).json({ message: 'Unauthorized user' })
				return
			}
			// Check if bidEndDate is updated
			const isBidEndDateUpdated =
				req.body.bidEndDate &&
				new Date(req.body.bidEndDate).getTime() !==
					new Date(car.bidEndDate).getTime()
			let updatedImageData = {}
			const files = req.files as Express.Multer.File[]
			console.log(isBidEndDateUpdated)
			// if (files) {
			// 	const images = files.map((file) => file.originalname)
			// 	updatedImageData = { ...req.body, images: images }
			// } else {
			// 	updatedImageData = req.body
			// }
			if (files.length !== 0) {
				//console.log('car chhe')
				files.forEach((file) => {
					car.images.push(file.originalname)
				})
				updatedImageData = { ...req.body, images: car.images }
			} else {
				//console.log('car nthi')
				// If no new images are provided, retain the existing images
				updatedImageData = { ...req.body, images: car.images }
			}

			const result = await carModel.findByIdAndUpdate(
				req.params.id,
				updatedImageData,
				{ new: true }
			)
			if (isBidEndDateUpdated === true) {
				const deletenoti = await notificationmodel.deleteMany({
					car: car._id,
					type: 'bidEndDateUpdate',
				})
				if (!deletenoti) {
					res.status(404).json({ message: 'Notification not found' })
					console.log('Notification not found')
					return
				}
				// Optionally, emit a message to update any live UI elements that the notification has been removed
				io.emit('notificationRemoved', {
					car: car._id,
					message: {
						$regex: `Update Bid ending date or remove a car : ${car.brand} ${car.Model}`,
					},
				})
			}
			res.status(200).send(result)
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: 'Internal Server Error' })
		}
	}

	//delete a car
	static deleteCarById = async (req: Request, res: Response): Promise<void> => {
		try {
			const authorization = req.headers.authorization
			console.log(authorization)
			if (!authorization) {
				res.status(401).json({ message: 'Unauthorized user' })
				return
			}

			const token = authorization.split(' ')[1]
			if (!token) {
				res.status(401).json({ message: 'Unauthorized user' })
				return
			}
			console.log('token:', token)

			const decodedToken = jwt.verify(
				token,
				process.env.JWT_SECRET_KEY
			) as Jwt & JwtPayload
			const userID = decodedToken.userID as string
			console.log('userID:', userID)

			const car = await carModel.findById(req.params.id)
			if (!car) {
				res.status(404).json({ message: 'Car not found' })
				return
			}
			//console.log(String(car.user))
			if (String(car.user) !== userID) {
				res.status(403).json({ message: 'Unauthorized user' })
				return
			}
			await notificationmodel.deleteMany({ car: req.params.id })
			// Update the car document to mark it as deleted
			const result = await carModel.findByIdAndUpdate(req.params.id, {
				deleted: true,
			})
			if (!result) {
				res.status(500).json({ message: 'Failed to mark car as deleted' })
				return
			}

			res
				.status(200)
				.json({ success: true, message: 'Car marked as deleted successfully' })
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: 'Internal Server Error' })
		}
	}

	//search a car
	static search = async (req: Request, res: Response): Promise<void> => {
		try {
			const searchParam = req.query.search as string | string[] | undefined

			if (!searchParam) {
				res.status(400).json({ error: 'Search parameter is missing' })
				return
			}

			let brandSearch: string | undefined
			let modelSearch: string | undefined
			let descSearch: string | undefined

			if (typeof searchParam === 'string') {
				brandSearch = searchParam
				modelSearch = searchParam
				descSearch = searchParam
			} else {
				;[brandSearch, modelSearch, descSearch] = searchParam
			}

			const cars = await carModel.find({
				$and: [
					{
						$or: [
							{ brand: { $regex: brandSearch, $options: 'i' } },
							{ Model: { $regex: modelSearch, $options: 'i' } },
							{ desc: { $regex: descSearch, $options: 'i' } },
						],
					},
					{ deleted: false },
					{ isApproved: true },
				],
			})

			res.json({ cars })
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: 'Internal Server Error' })
		}
	}

	//filter cars by baseAmount
	static filterByBaseAmount = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const minPrice: number = Number(req.query.minPrice)
			const maxPrice: number = Number(req.query.maxPrice)

			if (isNaN(minPrice) && isNaN(maxPrice)) {
				res.status(400).json({ error: 'Invalid minPrice or maxPrice' })
				return
			}

			const priceCriteria: any = {}

			if (!isNaN(minPrice)) {
				priceCriteria.$gte = minPrice
			}

			if (!isNaN(maxPrice)) {
				priceCriteria.$lte = maxPrice
			}

			const filteredCars = await carModel.find({
				baseAmount: priceCriteria,
			})

			//console.log(filteredCars)
			res.json({ cars: filteredCars })
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: 'Internal Server Error' })
		}
	}
}

export default CarController
