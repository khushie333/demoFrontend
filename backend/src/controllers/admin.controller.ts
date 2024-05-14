import { Request, Response } from 'express'
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'
import { bidModel } from '../models/bid/bid.model'
import carModel from '../models/car/car.model'
import notificationmodel from '../models/notification/noti.model'
import { Server as SocketIOServer } from 'socket.io'
import { io } from '../server'
import UserModel from '../models/user/user.model'
interface ProcessEnv {
	[key: string]: string
}

declare const process: {
	env: ProcessEnv
}
class AdminController {
	//view new user
	static async ViewNewCar(req: Request, res: Response): Promise<void> {
		try {
			// Fetch newly added cars from the database
			const newlyAddedCars = await carModel
				.find({ isApproved: false })
				.populate('user')

			res.status(200).json(newlyAddedCars)
		} catch (error) {
			console.error('Error fetching newly added cars:', error)
			res.status(500).json({ error: 'Internal Server Error' })
		}
	}

	//approve cars of users
	static async approveCar(req: Request, res: Response): Promise<void> {
		try {
			const { Authorization } = req.body.headers
			const { carId } = req.params

			const token = Authorization?.split(' ')[1]

			if (!token) {
				res.status(401).json({ message: 'No token provided' })
				return
			}

			const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY)
			const userId = decodedToken.userID

			const user = await UserModel.findById(userId)

			if (!user) {
				res.status(404).json({ message: 'User not found' })
				return
			}

			if (!user.isAdmin) {
				res.status(403).json({ message: 'Access denied' })
				return
			}

			const car = await carModel.findById(carId)
			if (!car) {
				res.status(404).json({ message: 'Car not found' })
				return
			}

			car.isApproved = true

			await car.save()
			const deletenoti = await notificationmodel.deleteMany({
				car: car._id,
				type: 'NewCar',
			})
			if (!deletenoti) {
				res.status(404).json({ message: 'Notification not found' })
				console.log('Notification not found')
				return
			}
			res.status(200).json({ message: 'Car approved successfully', car })
		} catch (error) {
			console.error('Approve Car Error:', error)
			res.status(500).json({ message: 'Internal server error' })
		}
	}

	//Reject cars of a user
	static async disapproveCar(req: Request, res: Response): Promise<void> {
		try {
			const { Authorization } = req.body.headers
			const { carId } = req.params

			const token = Authorization?.split(' ')[1]

			if (!token) {
				res.status(401).json({ message: 'No token provided' })
				return
			}

			const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY)
			const userId = decodedToken.userID

			const user = await UserModel.findById(userId)

			if (!user) {
				res.status(404).json({ message: 'User not found' })
				return
			}

			if (!user.isAdmin) {
				res.status(403).json({ message: 'Access denied' })
				return
			}

			const car = await carModel.findById(carId)
			if (!car) {
				res.status(404).json({ message: 'Car not found' })
				return
			}

			car.isApproved = false
			await car.save()
			const deletenoti = await notificationmodel.deleteMany({
				car: car._id,
				type: 'NewCar',
			})
			await carModel.findByIdAndDelete(carId)
			if (!deletenoti) {
				res.status(404).json({ message: 'Notification not found' })
				console.log('Notification not found')
				return
			}
			await notificationmodel.create({
				user: car.user,
				car: car._id,
				type: 'CarRejection',
				message:
					'Your car submission has been rejected because of insuffcient data for auction.',
			})
			res.status(200).json({ message: 'Car approved successfully', car })
		} catch (error) {
			console.error('Approve Car Error:', error)
			res.status(500).json({ message: 'Internal server error' })
		}
	}

	//view cars by userId
	static async viewCarsbyUserId(req: Request, res: Response): Promise<void> {
		const { authorization } = req.headers
		const token = authorization?.split(' ')[1]

		if (!token) {
			res.status(401).json({ status: 'failed', message: 'No token provided' })
			return
		}
		const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY)
		const userId = decodedToken.userID

		const user = await UserModel.findById(userId)

		if (!user) {
			res.status(404).json({ message: 'User not found' })
			return
		}

		if (!user.isAdmin) {
			res.status(403).json({ message: 'Access denied' })
			return
		}
		// console.log(user)
		// console.log(userId)
		const { userID } = req.params
		// console.log(userID)

		try {
			const cars = await carModel.find({ user: userID })
			res.json(cars)
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: 'Internal server error' })
		}
	}

	//Block user
	static async deactivateUserHandler(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const userId = req.params.userId
			// Find the user by ID and update the isActive flag
			await UserModel.findByIdAndUpdate(userId, { active: false })

			// Call method to delete user's cars
			await AdminController.deleteCarsByUserId(userId)

			res
				.status(200)
				.json({ success: true, message: 'User deactivated successfully' })
		} catch (error) {
			console.error('Error deactivating user:', error)
			res
				.status(500)
				.json({ success: false, message: 'Failed to deactivate user' })
		}
	}

	//Activate a user
	static async activateUserHandler(req: Request, res: Response): Promise<void> {
		try {
			const userId = req.params.userId
			// Find the user by ID and update the isActive flag
			await UserModel.findByIdAndUpdate(userId, { active: true })

			// Call method to delete user's cars
			await AdminController.deleteCarsByUserId(userId)

			res
				.status(200)
				.json({ success: true, message: 'User deactivated successfully' })
		} catch (error) {
			console.error('Error deactivating user:', error)
			res
				.status(500)
				.json({ success: false, message: 'Failed to deactivate user' })
		}
	}

	//delete cars
	static async deleteCarsByUserId(userId: string): Promise<void> {
		try {
			// Delete cars associated with the user
			await carModel.deleteMany({ user: userId })
		} catch (error) {
			console.error('Error deleting user cars:', error)
			throw new Error('Failed to delete user cars')
		}
	}
}

export default AdminController
