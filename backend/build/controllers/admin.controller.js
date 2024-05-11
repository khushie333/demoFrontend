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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const car_model_1 = __importDefault(require("../models/car/car.model"));
const noti_model_1 = __importDefault(require("../models/notification/noti.model"));
const user_model_1 = __importDefault(require("../models/user/user.model"));
class AdminController {
    static ViewNewCar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch newly added cars from the database
                const newlyAddedCars = yield car_model_1.default
                    .find({ isApproved: false })
                    .populate('user');
                res.status(200).json(newlyAddedCars);
            }
            catch (error) {
                console.error('Error fetching newly added cars:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    static approveCar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { Authorization } = req.body.headers;
                const { carId } = req.params;
                const token = Authorization === null || Authorization === void 0 ? void 0 : Authorization.split(' ')[1];
                if (!token) {
                    res.status(401).json({ message: 'No token provided' });
                    return;
                }
                const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
                const userId = decodedToken.userID;
                const user = yield user_model_1.default.findById(userId);
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                if (!user.isAdmin) {
                    res.status(403).json({ message: 'Access denied' });
                    return;
                }
                const car = yield car_model_1.default.findById(carId);
                if (!car) {
                    res.status(404).json({ message: 'Car not found' });
                    return;
                }
                car.isApproved = true;
                yield car.save();
                const deletenoti = yield noti_model_1.default.deleteMany({
                    car: car._id,
                    type: 'NewCar',
                });
                if (!deletenoti) {
                    res.status(404).json({ message: 'Notification not found' });
                    console.log('Notification not found');
                    return;
                }
                res.status(200).json({ message: 'Car approved successfully', car });
            }
            catch (error) {
                console.error('Approve Car Error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    static disapproveCar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { Authorization } = req.body.headers;
                const { carId } = req.params;
                const token = Authorization === null || Authorization === void 0 ? void 0 : Authorization.split(' ')[1];
                if (!token) {
                    res.status(401).json({ message: 'No token provided' });
                    return;
                }
                const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
                const userId = decodedToken.userID;
                const user = yield user_model_1.default.findById(userId);
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                if (!user.isAdmin) {
                    res.status(403).json({ message: 'Access denied' });
                    return;
                }
                const car = yield car_model_1.default.findById(carId);
                if (!car) {
                    res.status(404).json({ message: 'Car not found' });
                    return;
                }
                car.isApproved = false;
                yield car.save();
                const deletenoti = yield noti_model_1.default.deleteMany({
                    car: car._id,
                    type: 'NewCar',
                });
                yield car_model_1.default.findByIdAndDelete(carId);
                if (!deletenoti) {
                    res.status(404).json({ message: 'Notification not found' });
                    console.log('Notification not found');
                    return;
                }
                yield noti_model_1.default.create({
                    user: car.user,
                    car: car._id,
                    type: 'CarRejection',
                    message: 'Your car submission has been rejected because of insuffcient data for auction.',
                });
                res.status(200).json({ message: 'Car approved successfully', car });
            }
            catch (error) {
                console.error('Approve Car Error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    static viewCarsbyUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { authorization } = req.headers;
            const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
            if (!token) {
                res.status(401).json({ status: 'failed', message: 'No token provided' });
                return;
            }
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
            const userId = decodedToken.userID;
            const user = yield user_model_1.default.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            if (!user.isAdmin) {
                res.status(403).json({ message: 'Access denied' });
                return;
            }
            // console.log(user)
            // console.log(userId)
            const { userID } = req.params;
            // console.log(userID)
            try {
                const cars = yield car_model_1.default.find({ user: userID });
                res.json(cars);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    static deactivateUserHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                // Find the user by ID and update the isActive flag
                yield user_model_1.default.findByIdAndUpdate(userId, { active: false });
                // Call method to delete user's cars
                yield AdminController.deleteCarsByUserId(userId);
                res
                    .status(200)
                    .json({ success: true, message: 'User deactivated successfully' });
            }
            catch (error) {
                console.error('Error deactivating user:', error);
                res
                    .status(500)
                    .json({ success: false, message: 'Failed to deactivate user' });
            }
        });
    }
    static activateUserHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                // Find the user by ID and update the isActive flag
                yield user_model_1.default.findByIdAndUpdate(userId, { active: true });
                // Call method to delete user's cars
                yield AdminController.deleteCarsByUserId(userId);
                res
                    .status(200)
                    .json({ success: true, message: 'User deactivated successfully' });
            }
            catch (error) {
                console.error('Error deactivating user:', error);
                res
                    .status(500)
                    .json({ success: false, message: 'Failed to deactivate user' });
            }
        });
    }
    static deleteCarsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Delete cars associated with the user
                yield car_model_1.default.deleteMany({ user: userId });
            }
            catch (error) {
                console.error('Error deleting user cars:', error);
                throw new Error('Failed to delete user cars');
            }
        });
    }
}
exports.default = AdminController;
