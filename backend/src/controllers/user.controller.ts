import { Request, Response } from 'express'
import { controller } from 'inversify-express-utils'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserModel, User } from '../models/user/user.model'
import carModel from '../models/car/car.model'
import mongoose from 'mongoose'
import Stripe from 'stripe'
interface ProcessEnv {
	[key: string]: string
}

declare const process: {
	env: ProcessEnv
}
const stripe = new Stripe(
	'sk_test_51PE5x3FrSZSbREzfwfNBWDhQZ7maPRruARip9VoASQ47gG28YzqTkimUflbBMzLGQfjxQNTua6CWSgpEo9gTjQBm00RlUl9qPr'
)

interface AuthenticatedRequest extends Request {
	user?: User
}
export async function getUsers(req: Request, res: Response): Promise<void> {
	try {
		const users = await UserModel.find()
		res.status(200).json(users)
	} catch (error) {
		res.status(500).json({ message: 'Error fetching users', error })
	}
}
export async function getUsersById(req: Request, res: Response): Promise<void> {
	const userId = req.params.userId

	try {
		const user = await UserModel.findById(userId)

		if (!user) {
			res.status(404).json({ message: 'User not found' })
			return
		}

		res.status(200).json(user)
	} catch (error) {
		res.status(500).json({ message: 'Error fetching user', error })
	}
}
// export async function userReg(req: Request, res: Response): Promise<void> {
// 	const { name, email, phone, address, password, password_conf, active } =
// 		req.body

// 	try {
// 		// Checking email duplication
// 		//console.log(req.body)
// 		const user = await UserModel.findOne({ email })
// 		if (user) {
// 			res
// 				.status(400)
// 				.json({ status: 'failed', message: 'Email already exists' })
// 			return
// 		}

// 		if (name && email && phone && address && password && password_conf) {
// 			if (password === password_conf) {
// 				// Hash password
// 				const salt = await bcrypt.genSalt(10)
// 				const hashPassword = await bcrypt.hash(password, salt)

// 				// Create new user
// 				const newUser = new UserModel({
// 					name,
// 					email,
// 					phone,
// 					address,
// 					password: hashPassword,
// 					active,
// 					stripeCustomerId: null,
// 				})
// 				await newUser.save()
// 				// Get saved user
// 				const stripeCustomer = await stripe.customers.create({
// 					name: name,
// 					email: email,
// 					// Add more customer details as needed
// 				})
// 				console.log('st:', stripeCustomer)

// 				// Get saved user
// 				const savedUser = await UserModel.findOne({ email })
// 				console.log(savedUser)
// 				if (!savedUser) {
// 					throw new Error('User not found after saving')
// 				}

// 				// Save the Stripe customer ID to the user document
// 				savedUser.stripeCustomerId = stripeCustomer.id
// 				await savedUser.save()

// 				// Generate JWT token
// 				const token = jwt.sign(
// 					{ userID: savedUser._id },
// 					process.env.JWT_SECRET_KEY || '',
// 					{ expiresIn: '30d' }
// 				)

// 				res.status(201).json({
// 					status: 'success',
// 					message: 'Registered successfully',
// 					token,
// 				})
// 			} else {
// 				res
// 					.status(400)
// 					.json({ status: 'failed', message: 'Passwords are not matching' })
// 			}
// 		} else {
// 			res
// 				.status(400)
// 				.json({ status: 'failed', message: 'All fields are required' })
// 		}
// 	} catch (error) {
// 		res
// 			.status(500)
// 			.json({ status: 'failed', message: 'Unable to register', error })
// 	}
// }
export async function userReg(req: Request, res: Response): Promise<void> {
	const { name, email, phone, address, password, password_conf, active } =
		req.body

	try {
		// Checking email duplication
		const user = await UserModel.findOne({ email })
		if (user) {
			res
				.status(400)
				.json({ status: 'failed', message: 'Email already exists' })
			return
		}

		if (name && email && phone && address && password && password_conf) {
			if (password === password_conf) {
				// Hash password
				const salt = await bcrypt.genSalt(10)
				const hashPassword = await bcrypt.hash(password, salt)

				// Create new user
				const newUser = new UserModel({
					name,
					email,
					phone,
					address,
					password: hashPassword,
					active,
				})

				// Get saved user
				await newUser.save()

				// Create Stripe customer
				const stripeCustomer = await stripe.customers.create({
					name: name,
					email: email,
					// Add more customer details as needed
				})

				// Update user with Stripe customer ID
				newUser.stripeCustomerId = stripeCustomer.id
				await newUser.save()

				// Generate JWT token
				const token = jwt.sign(
					{ userID: newUser._id },
					process.env.JWT_SECRET_KEY || '',
					{ expiresIn: '30d' }
				)

				res.status(201).json({
					status: 'success',
					message: 'Registered successfully',
					token,
				})
			} else {
				res
					.status(400)
					.json({ status: 'failed', message: 'Passwords are not matching' })
			}
		} else {
			res
				.status(400)
				.json({ status: 'failed', message: 'All fields are required' })
		}
	} catch (error) {
		res
			.status(500)
			.json({ status: 'failed', message: 'Unable to register', error })
	}
}

export async function updateUserProfile(
	req: AuthenticatedRequest,
	res: Response
): Promise<void> {
	const { authorization } = req.headers
	const token = authorization?.split(' ')[1]

	if (!token) {
		res.status(401).json({ status: 'failed', message: 'No token provided' })
		return
	}

	const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY)

	// Extract user ID from decoded token
	const userId: string = decodedToken.userID
	const { name, email, phone, address } = req.body

	try {
		const user = await UserModel.findById(userId)

		if (!user) {
			res.status(404).json({ status: 'failed', message: 'User not found' })
			return
		}

		// Conditional updates based on provided fields
		if (name) user.name = name
		if (phone) user.phone = phone
		if (address) user.address = address

		// Check if new email is provided and it's different from current
		if (email && user.email !== email) {
			const emailExists = await UserModel.findOne({ email })
			if (emailExists) {
				res
					.status(400)
					.json({ status: 'failed', message: 'Email already in use' })
				return
			}
			user.email = email
		}

		await user.save()
		res
			.status(200)
			.json({ status: 'success', message: 'Profile updated successfully' })
	} catch (error) {
		res
			.status(500)
			.json({ status: 'failed', message: 'Error updating profile', error })
	}
}

export async function viewCarsOfUser(
	req: AuthenticatedRequest,
	res: Response
): Promise<void> {
	const { authorization } = req.headers
	const token = authorization?.split(' ')[1]

	if (!token) {
		res.status(401).json({ status: 'failed', message: 'No token provided' })
		return
	}
	const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY)
	const userId: string = decodedToken.userID
	try {
		const cars = await carModel.find({ user: userId })
		res.json(cars)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Internal server error' })
	}
}
export async function getuserdatafromid(
	req: AuthenticatedRequest,
	res: Response
): Promise<void> {
	const { authorization } = req.headers
	const token = authorization?.split(' ')[1]

	if (!token) {
		res.status(401).json({ error: 'No token provided' })
		return
	}

	try {
		// Verify the token
		const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY)
		const userId: string = decodedToken.userID

		// Check if userId is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			res.status(400).json({ error: 'Invalid user ID' })
			return
		}

		const user = await UserModel.findById(userId)

		if (!user) {
			res.status(404).json({ error: 'User not found' })
			return
		}

		// Send user data in the response
		res.json(user)
	} catch (error) {
		console.error('Error fetching user data:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}
