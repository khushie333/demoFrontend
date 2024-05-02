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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
const car_model_1 = require("../models/car/car.model");
//import { upload } from '../middlewares/multer.middleware'
const noti_model_1 = __importDefault(require("../models/notification/noti.model"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Destination directory for uploaded files
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    },
});
exports.upload = (0, multer_1.default)({ storage }).array('images', 5);
class CarController {
}
_a = CarController;
//createCar
CarController.createCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }
        const token = authorization.split(' ')[1];
        if (!token) {
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }
        //	console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY)
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const userID = decodedToken.userID;
        const { brand, Model, desc, owner, baseAmount, bidStartDate, bidEndDate, } = req.body;
        try {
            const startDate = new Date(bidStartDate);
            const endDate = new Date(bidEndDate);
            if (endDate <= startDate) {
                res
                    .status(400)
                    .json({ error: 'Bid end date must be after bid start date.' });
                return;
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        const files = req.files;
        const images = files.map((file) => file.originalname);
        const carData = new car_model_1.carModel({
            user: userID,
            brand,
            Model,
            desc,
            owner,
            images,
            baseAmount,
            bidStartDate,
            bidEndDate,
        });
        const car = new car_model_1.carModel(carData);
        const result = yield car.save();
        res.status(201).send(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
//get All the cars
CarController.getAllCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield car_model_1.carModel.find();
        res.send(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
//get Single car by id
CarController.getSingleCarById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield car_model_1.carModel.findById(req.params.id);
        if (!result) {
            res.status(404).send({ message: 'Car not found' });
            return;
        }
        res.send(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
//update car by id
CarController.updateCarById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(401).json({ message: 'Unauthorized user' });
            return;
        }
        const token = authorization.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized user' });
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const userID = decodedToken.userID;
        //console.log(userID)
        const car = yield car_model_1.carModel.findById(req.params.id);
        if (!car) {
            res.status(404).json({ message: 'Car not found' });
            return;
        }
        //console.log(String(car.user))
        if (String(car.user) !== userID) {
            res.status(403).json({ message: 'Unauthorized user' });
            return;
        }
        // Check if bidEndDate is updated
        const isBidEndDateUpdated = req.body.bidEndDate &&
            new Date(req.body.bidEndDate).getTime() !==
                new Date(car.bidEndDate).getTime();
        let updatedImageData = {};
        const files = req.files;
        // if (files) {
        // 	const images = files.map((file) => file.originalname)
        // 	updatedImageData = { ...req.body, images: images }
        // } else {
        // 	updatedImageData = req.body
        // }
        if (files.length !== 0) {
            console.log('car chhe');
            files.forEach((file) => {
                car.images.push(file.originalname);
            });
            updatedImageData = Object.assign(Object.assign({}, req.body), { images: car.images });
        }
        else {
            console.log('car nthi');
            // If no new images are provided, retain the existing images
            updatedImageData = Object.assign(Object.assign({}, req.body), { images: car.images });
        }
        const result = yield car_model_1.carModel.findByIdAndUpdate(req.params.id, updatedImageData, { new: true });
        if (isBidEndDateUpdated) {
            yield noti_model_1.default.deleteOne({ car: car._id });
            // Optionally, emit a message to update any live UI elements that the notification has been removed
            //io.emit('notificationRemoved', { carId: car._id });
        }
        res.status(200).send(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
// delete car by id
// static deleteCarById = async (req: Request, res: Response): Promise<void> => {
// 	try {
// 		const authorization = req.headers.authorization
// 		if (!authorization) {
// 			res.status(401).json({ message: 'Unauthorized user' })
// 			return
// 		}
// 		const token = authorization.split(' ')[1]
// 		if (!token) {
// 			res.status(401).json({ message: 'Unauthorized user' })
// 			return
// 		}
// 		const decodedToken = jwt.verify(
// 			token,
// 			process.env.JWT_SECRET_KEY
// 		) as Jwt & JwtPayload
// 		const userID = decodedToken.userID as string
// 		const car = await carModel.findById(req.params.id)
// 		if (!car) {
// 			res.status(404).json({ message: 'Car not found' })
// 			return
// 		}
// 		if (String(car.user) !== userID) {
// 			res.status(403).json({ message: 'Unauthorized user' })
// 			return
// 		}
// 		const result = await carModel.findByIdAndDelete(req.params.id)
// 		res
// 			.status(200)
// 			.json({ success: true, message: 'Car deleted successfully' })
// 	} catch (error) {
// 		console.error(error)
// 		res.status(500).json({ message: 'Internal Server Error' })
// 	}
// }
CarController.deleteCarById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('hii');
        const authorization = req.headers.authorization;
        console.log(authorization);
        if (!authorization) {
            res.status(401).json({ message: 'Unauthorized user' });
            return;
        }
        const token = authorization.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized user' });
            return;
        }
        console.log('token:', token);
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const userID = decodedToken.userID;
        console.log('userID:', userID);
        const car = yield car_model_1.carModel.findById(req.params.id);
        if (!car) {
            res.status(404).json({ message: 'Car not found' });
            return;
        }
        console.log(String(car.user));
        if (String(car.user) !== userID) {
            res.status(403).json({ message: 'Unauthorized user' });
            return;
        }
        yield noti_model_1.default.deleteMany({ car: req.params.id });
        // Update the car document to mark it as deleted
        const result = yield car_model_1.carModel.findByIdAndUpdate(req.params.id, {
            deleted: true,
        });
        if (!result) {
            res.status(500).json({ message: 'Failed to mark car as deleted' });
            return;
        }
        res
            .status(200)
            .json({ success: true, message: 'Car marked as deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
//search car by model
// static search = async (req: Request, res: Response): Promise<void> => {
// 	try {
// 		const search: string | undefined = req.query.search as string | undefined
// 		if (!search) {
// 			res.status(400).json({ error: 'Search parameter is missing' })
// 			return
// 		}
// 		//console.log('Search parameter:', search)
// 		const cars = await carModel.find({
// 			$or: [
// 				{ brand: { $regex: search, $options: 'i' } },
// 				{ Model: { $regex: search, $options: 'i' } },
// 			],
// 		})
// 		console.log(cars)
// 		res.json({ cars: cars })
// 	} catch (error) {
// 		console.error(error)
// 		res.status(500).json({ error: 'Internal Server Error' })
// 	}
// }
CarController.search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchParam = req.query.search;
        if (!searchParam) {
            res.status(400).json({ error: 'Search parameter is missing' });
            return;
        }
        let brandSearch;
        let modelSearch;
        if (typeof searchParam === 'string') {
            brandSearch = searchParam;
            modelSearch = searchParam;
        }
        else {
            ;
            [brandSearch, modelSearch] = searchParam;
        }
        const cars = yield car_model_1.carModel.find({
            $or: [
                { brand: { $regex: brandSearch, $options: 'i' } },
                { Model: { $regex: modelSearch, $options: 'i' } },
            ],
        });
        res.json({ cars });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//filter cars by baseAmount
CarController.filterByBaseAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const minPrice = Number(req.query.minPrice);
        const maxPrice = Number(req.query.maxPrice);
        if (isNaN(minPrice) && isNaN(maxPrice)) {
            res.status(400).json({ error: 'Invalid minPrice or maxPrice' });
            return;
        }
        const priceCriteria = {};
        if (!isNaN(minPrice)) {
            priceCriteria.$gte = minPrice;
        }
        if (!isNaN(maxPrice)) {
            priceCriteria.$lte = maxPrice;
        }
        const filteredCars = yield car_model_1.carModel.find({
            baseAmount: priceCriteria,
        });
        //console.log(filteredCars)
        res.json({ cars: filteredCars });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = CarController;
