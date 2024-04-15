import { Request, Response } from 'express'
import userModel, { User } from '../../models/user/user.model' // Assuming you have a User interface exported from User.js
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import transporter from '../../config/emailConf'
import { authenticateUser } from '../../middlewares/authenticate.middleware'

interface AuthenticatedRequest extends Request {
	user?: User
}

class loginController {
	public static userLogin = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const { email, password }: { email: string; password: string } = req.body
			if (email && password) {
				const user: User | null = await userModel.findOne({ email: email })
				if (user !== null) {
					const isMatching: boolean = await bcrypt.compare(
						password,
						user.password
					)
					if (user.email === email && isMatching) {
						// JWT token
						const token: string = jwt.sign(
							{ userID: user._id },
							process.env.JWT_SECRET_KEY || '',
							{ expiresIn: '30d' }
						)
						res.cookie('jwt', token, {
							httpOnly: true,
							maxAge: 24 * 60 * 60 * 1000,
						})
						res.status(201).send({
							status: 'success',
							message: 'logged in successfully',
							token: token,
						})
					} else {
						res.send({
							status: 'failed',
							message: 'username or password is wrong',
						})
					}
				} else {
					res.send({ status: 'failed', message: 'not a registered user' })
				}
			} else {
				res.send({ status: 'failed', message: 'all fields are required' })
			}
		} catch (error) {
			res.send({
				status: 'failed',
				message: 'unable to login',
			})
		}
	}
	// View loggedinuser
	public static loggedinuser = async (
		req: AuthenticatedRequest,
		res: Response
	): Promise<void> => {
		try {
			const cookie = req.cookies['jwt']
			const claims = jwt.verify(cookie, process.env.JWT_SECRET_KEY || '') as
				| { userID: string }
				| undefined
			if (!claims) {
				res.status(401).send({
					message: 'Unauthorized User',
				})
				return
			}

			// Find user by ID
			//console.log(claims)

			const user = await userModel.findOne({ _id: claims.userID })
			//console.log(user)
			if (!user) {
				res.status(404).send({
					message: 'User not found',
				})
				return
			}

			// Remove sensitive data before sending response
			const { password, ...data } = user.toJSON()
			res.send(data)
		} catch (error) {
			console.error('Error:', error)
			res.status(500).send({
				message: 'cookie has expired',
			})
		}
	}
	//logOUT
	public static logoutUser = async (
		req: AuthenticatedRequest,
		res: Response
	): Promise<void> => {
		res.cookie('jwt', '', { maxAge: 0 })
		res.send({
			message: 'success',
		})
	}

	// change password

	public static changePassword = async (
		req: AuthenticatedRequest,
		res: Response
	): Promise<void> => {
		const {
			password,
			password_conf,
		}: { password: string; password_conf: string } = req.body
		if (password && password_conf) {
			if (password !== password_conf) {
				res.send({
					status: 'failed',
					message: 'passwords not matching',
				})
			} else {
				const salt: string = await bcrypt.genSalt(10)
				const newhashPassword: string = await bcrypt.hash(password, salt)
				// console.log(req.body) // Check if the request body contains password and password_conf fields
				// console.log(req.user?._id) // Check if the user ID is correctly set

				// // Mongoose findByIdAndUpdate method call
				// console.log(`Updating password for user with ID: ${req.user?._id}`)
				// find by id and update the password
				const result = await userModel.findByIdAndUpdate(req.user?._id, {
					$set: {
						password: newhashPassword,
					},
				})

				res.status(201).send({
					status: 'success',
					message: 'successfully changed password',
				})
				//console.log(result)
			}
		} else {
			res.send({ status: 'failed', message: 'all fields are required' })
		}
	}
}

export default loginController
