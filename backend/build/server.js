"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const node_cron_1 = __importDefault(require("node-cron"));
const car_model_1 = __importDefault(require("./models/car/car.model"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const authentication_routes_1 = __importDefault(require("./routes/authentication.routes"));
const email_routes_1 = __importDefault(require("./routes/email.routes"));
const car_routes_1 = __importDefault(require("./routes/car.routes"));
const bid_routes_1 = __importDefault(require("./routes/bid.routes"));
const noti_routes_1 = __importDefault(require("./routes/noti.routes"));
const errorHandling_middleware_1 = require("./middlewares/errorHandling.middleware");
const connectDB_1 = require("./config/connectDB");
const noti_model_1 = __importDefault(require("./models/notification/noti.model"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const stripe_1 = __importDefault(require("stripe"));
const stripe_routes_1 = __importDefault(require("./routes/stripe.routes"));
//import bidModel from './models/bid/bid.model'
const appConfig = new connectDB_1.AppConfig();
appConfig.initialize();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true }));
app.use(express_1.default.static('uploads'));
app.use((0, cookie_parser_1.default)());
app.use('/images', express_1.default.static(path_1.default.join(__dirname, 'public')));
const mongoUrl = appConfig.getMongoUrl();
mongoose_1.default
    .connect(mongoUrl)
    .then(() => console.log('MongoDB connected successfully!!!'))
    .catch((error) => console.error('oops, Error connecting to MongoDB:', error));
// listening with http server for socket.io
const httpServer = new http_1.default.Server(app);
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    },
});
exports.io.on('connection', (socket) => {
    socket.on('register', (userId) => {
        socket.join(userId.toString());
    });
    console.log('User connected');
});
node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
    const now = new Date();
    const oneMinutesAgo = new Date(now.getTime() - 1 * 60 * 1000);
    const bufferedDate = new Date(now.getTime() - bufferTime);
    console.log(`Cron job running at: ${now.toISOString()}`);
    const expiredCars = yield car_model_1.default.find({
        bidEndDate: { $lt: bufferedDate },
        deleted: false,
    });
    for (const car of expiredCars) {
        // Check if a notification already exists
        const existingNotification = yield noti_model_1.default.findOne({
            car: car._id,
            type: 'bidEndDateUpdate',
        });
        if (!existingNotification) {
            // If no existing notification, emit a new one
            exports.io.emit('notifyUpdate', {
                message: `Update Bid ending date or remove a car : ${car.brand} ${car.Model}`,
                carId: car._id,
            });
            // Save the notification record to avoid duplicate notifications
            yield noti_model_1.default.create({
                car: car._id,
                user: car.user,
                type: 'bidEndDateUpdate',
                message: `Update or remove your car with ID: ${car.brand} ${car.Model}`,
                isread: false,
            });
        }
    }
    console.log('Cron job ran checking for expired bid end dates');
}));
const port = process.env.PORT || appConfig.getServerPort();
httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
app.use('/api', user_routes_1.default);
app.use('/api', authentication_routes_1.default);
app.use('/api', email_routes_1.default);
app.use('/api', car_routes_1.default);
app.use('/api', bid_routes_1.default);
app.use('/api', noti_routes_1.default);
app.use('/api', admin_routes_1.default);
app.use('/api', stripe_routes_1.default);
app.use(errorHandling_middleware_1.errorHandler);
app.use(errorHandling_middleware_1.handleError);
exports.default = app;
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
