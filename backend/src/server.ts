import mongoose from 'mongoose'
import express, { Application } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import cron from 'node-cron'
import carModel from './models/car/car.model'
import userRoutes from './routes/user.routes'
import authenticateRoutes from './routes/authentication.routes'
import emailRoutes from './routes/email.routes'
import carRoutes from './routes/car.routes'
import bidRoutes from './routes/bid.routes'
import notiRoutes from './routes/noti.routes'
import {
	errorHandler,
	handleError,
} from './middlewares/errorHandling.middleware'
import { AppConfig } from './config/connectDB'
import notificationmodel from './models/notification/noti.model'
import adminroutes from './routes/admin.routes'
import Stripe from 'stripe'
import stripeRoutes from './routes/stripe.routes'
//import bidModel from './models/bid/bid.model'

const appConfig = new AppConfig()
appConfig.initialize()

const app: Application = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.static('uploads'))
app.use(cookieParser())
app.use('/images', express.static(path.join(__dirname, 'public')))

const mongoUrl = appConfig.getMongoUrl()
mongoose
	.connect(mongoUrl)
	.then(() => console.log('MongoDB connected successfully!!!'))
	.catch((error) => console.error('oops, Error connecting to MongoDB:', error))

// listening with http server for socket.io
const httpServer = new http.Server(app)
export const io = new SocketIOServer(httpServer, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
	},
})

io.on('connection', (socket) => {
	socket.on('register', (userId) => {
		socket.join(userId.toString())
		console.log(`User with ID ${userId} connected and joined room`)
	})
})

cron.schedule('* * * * *', async () => {
	const bufferTime = 5 * 60 * 1000 // 5 minutes buffer

	const now = new Date()
	const oneMinutesAgo = new Date(now.getTime() - 1 * 60 * 1000)
	const bufferedDate = new Date(now.getTime() - bufferTime)
	console.log(`Cron job running at: ${now.toISOString()}`)
	const expiredCars = await carModel.find({
		bidEndDate: { $lt: bufferedDate },
		deleted: false,
	})

	for (const car of expiredCars) {
		// Check if a notification already exists
		const existingNotification = await notificationmodel.findOne({
			car: car._id,
			type: 'bidEndDateUpdate',
		})

		if (!existingNotification) {
			// If no existing notification, emit a new one
			io.to(car.user.toString()).emit('notifyUpdate', {
				message: `Update Bid ending date or remove a car : ${car.brand} ${car.Model}`,
				carId: car._id,
			})

			// Save the notification record to avoid duplicate notifications
			await notificationmodel.create({
				car: car._id,
				user: car.user,
				type: 'bidEndDateUpdate',
				message: `Update or remove your car with ID: ${car.brand} ${car.Model}`,
				isread: false,
			})
		}
	}
	console.log('Cron job ran checking for expired bid end dates')
})
const port = process.env.PORT || appConfig.getServerPort()
httpServer.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
app.use('/api', userRoutes)
app.use('/api', authenticateRoutes)
app.use('/api', emailRoutes)
app.use('/api', carRoutes)
app.use('/api', bidRoutes)
app.use('/api', notiRoutes)
app.use('/api', adminroutes)
app.use('/api', stripeRoutes)
app.use(errorHandler)
app.use(handleError)

export default app

// import mongoose from 'mongoose'
// import express, { Application } from 'express'
// import cors from 'cors'
// import cookieParser from 'cookie-parser'
// import path from 'path'

// //import multer from 'multer'

// //import bodyParser from 'body-parser'

// import userRoutes from './routes/user.routes'
// import authenticateRoutes from './routes/authentication.routes'
// import emailRoutes from './routes/email.routes'
// import carRoutes from './routes/car.routes'
// import bidRoutes from './routes/bid.routes'

// import {
// 	errorHandler,
// 	handleError,
// } from './middlewares/errorHandling.middleware'

// import { AppConfig } from './config/connectDB'

// const appConfig = new AppConfig()
// appConfig.initialize()

// //const app = express()
// const app: Application = express()
// app.use(express.json())

// //app.use(bodyParser.json()) // for parsing application/json
// app.use(express.urlencoded({ extended: true, limit: '10mb' }))
// //app.use(express.urlencoded({ extended: true }))
// app.use(cors())
// app.use(express.static('uploads'))
// app.use(cookieParser())
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
// app.use('/images', express.static(path.join(__dirname, 'public')))

// const mongoUrl = appConfig.getMongoUrl()

// const serverPort = appConfig.getServerPort()

// // Connecting to MongoDB cluster
// mongoose
// 	.connect(mongoUrl)
// 	.then(() => {
// 		console.log('MongoDB connected successfully!!!')
// 	})
// 	.catch((error) => {
// 		console.error('oops,Error connecting to MongoDB:', error)
// 	})

// const port = process.env.PORT || serverPort
// app.listen(port, () => {
// 	console.log(`Server is running on port ${port}`)
// })

// app.use('/api', userRoutes)
// app.use('/api', authenticateRoutes)

// app.use('/api', emailRoutes)
// app.use('/api', carRoutes)
// app.use('/api', bidRoutes)

// app.use(errorHandler)
// app.use(handleError)

// export default app
