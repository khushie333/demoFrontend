import { Request, Response } from 'express'
import userModel, { User } from '../../models/user/user.model' // Assuming you have a User interface exported from User.js
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import transporter from '../../config/emailConf'

interface ResetParams {
	id: string
	token: string
}

class ResetPasswordEmail {
	public static sendUserPassResetEmail = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const { email }: { email: string } = req.body
			if (email) {
				const user: User | null = await userModel.findOne({ email: email })

				if (user) {
					const secret: string = user._id + process.env.JWT_SECRET_KEY
					const token: string = jwt.sign({ userID: user._id }, secret, {
						expiresIn: '15m',
					})

					const link: string = `http://localhost:5000/api/ResetPassword/${user._id}/${token}`

					// Send email
					const info = await transporter.sendMail({
						from: process.env.EMAIL_FROM,
						to: user.email,
						subject: 'Password reset link',
						html: `<h2><a>${link}</a></h2>`,
					})

					res.status(201).send({
						status: 'success',
						message: 'Please check your email to reset password',
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
				message: 'Unable to send reset password email',
			})
		}
	}

	public static userPassReset = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			const {
				password,
				password_conf,
			}: { password: string; password_conf: string } = req.body
			const { id, token }: ResetParams = req.params as any

			const user: User | null = await userModel.findById(id)
			if (!user) {
				res.status(404).send({ status: 'failed', message: 'User not found' })
				return
			}

			const new_secret: string = user._id + process.env.JWT_SECRET_KEY

			jwt.verify(token, new_secret)

			if (!password || !password_conf) {
				res.send({ status: 'failed', message: 'Both fields are required' })
				return
			}

			if (password !== password_conf) {
				res.send({ status: 'failed', message: 'Passwords do not match' })
				return
			}

			const salt: string = await bcrypt.genSalt(10)
			const newhashPassword: string = await bcrypt.hash(password, salt)

			await userModel.findByIdAndUpdate(user._id, {
				$set: {
					password: newhashPassword,
				},
			})

			res.status(201).send({
				status: 'success',
				message: 'Successfully changed password',
			})
		} catch (error) {
			console.error(error)
			res.status(500).send({
				status: 'failed',
				message: 'Invalid token or unable to reset password',
			})
		}
	}
}

export default ResetPasswordEmail
