import { Request, Response } from 'express'
import { controller } from 'inversify-express-utils'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/user/user.model'

interface ProcessEnv {
	[key: string]: string | undefined
}

declare const process: {
	env: ProcessEnv
}

export async function getUsers(req: Request, res: Response): Promise<void> {
	try {
		const users = await UserModel.find()
		res.status(200).json(users)
	} catch (error) {
		res.status(500).json({ message: 'Error fetching users', error })
	}
}

export async function userReg(req: Request, res: Response): Promise<void> {
	const { name, email, phone, address, password, password_conf, active } =
		req.body

	try {
		// Checking email duplication
		//console.log(req.body)
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
				await newUser.save()

				// Get saved user
				const savedUser = await UserModel.findOne({ email })

				if (!savedUser) {
					throw new Error('User not found after saving')
				}

				// Generate JWT token
				const token = jwt.sign(
					{ userID: savedUser._id },
					process.env.JWT_SECRET_KEY || '',
					{ expiresIn: '30d' }
				)

				res.status(201).json({
					status: 'success',
					message: 'Records inserted successfully',
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
