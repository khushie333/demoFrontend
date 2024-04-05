import dotenv from 'dotenv'
dotenv.config()

import nodemailer, { Transporter } from 'nodemailer'

const transporter: Transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST || '',
	port: parseInt(process.env.EMAIL_PORT || '0', 10),
	secure: false,
	auth: {
		user: process.env.EMAIL_USER || '', //admin id
		pass: process.env.EMAIL_PASS || '', //admin pass
	},
})

export default transporter
