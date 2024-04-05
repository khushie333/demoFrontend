import mongoose from 'mongoose'
import express, { Application } from 'express'
import cors from 'cors'
//import multer from 'multer'

//import bodyParser from 'body-parser'

import userRoutes from './routes/user.routes'
import authenticateRoutes from './routes/authentication.routes'
import emailRoutes from './routes/email.routes'
import carRoutes from './routes/car.routes'
import bidRoutes from './routes/bid.routes'
import {
	errorHandler,
	handleError,
} from './middlewares/errorHandling.middleware'

import { AppConfig } from './config/connectDB'

const appConfig = new AppConfig()
appConfig.initialize()

//const app = express()
const app: Application = express()
app.use(express.json())
//app.use(bodyParser.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
//app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static('uploads'))

app.use(cors({ origin: 'http://localhost:3000' }))

const mongoUrl = appConfig.getMongoUrl()

const serverPort = appConfig.getServerPort()

// Connecting to MongoDB cluster
mongoose
	.connect(mongoUrl)
	.then(() => {
		console.log('MongoDB connected successfully')
	})
	.catch((error) => {
		console.error('oops,Error connecting to MongoDB:', error)
	})

const port = process.env.PORT || serverPort
app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})

app.use('/api', userRoutes)
app.use('/api', authenticateRoutes)

app.use('/api', emailRoutes)
app.use('/api', carRoutes)
app.use('/api', bidRoutes)

app.use(errorHandler)
app.use(handleError)

export default app
