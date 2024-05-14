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
exports.getuserdatafromid = exports.viewCarsOfUser = exports.updateUserProfile = exports.userReg = exports.getUsersById = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user/user.model");
const car_model_1 = __importDefault(require("../models/car/car.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default('sk_test_51PE5x3FrSZSbREzfwfNBWDhQZ7maPRruARip9VoASQ47gG28YzqTkimUflbBMzLGQfjxQNTua6CWSgpEo9gTjQBm00RlUl9qPr');
//get all users
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield user_model_1.UserModel.find();
            res.status(200).json(users);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching users', error });
        }
    });
}
exports.getUsers = getUsers;
//get users by id
function getUsersById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.userId;
        try {
            const user = yield user_model_1.UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json(user);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching user', error });
        }
    });
}
exports.getUsersById = getUsersById;
//Register a user
function userReg(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, phone, address, password, password_conf, active } = req.body;
        try {
            // Checking email duplication
            const user = yield user_model_1.UserModel.findOne({ email });
            if (user) {
                res
                    .status(400)
                    .json({ status: 'failed', message: 'Email already exists' });
                return;
            }
            if (name && email && phone && address && password && password_conf) {
                if (password === password_conf) {
                    // Hash password
                    const salt = yield bcrypt_1.default.genSalt(10);
                    const hashPassword = yield bcrypt_1.default.hash(password, salt);
                    // Create new user
                    const newUser = new user_model_1.UserModel({
                        name,
                        email,
                        phone,
                        address,
                        password: hashPassword,
                        active,
                    });
                    // Get saved user
                    yield newUser.save();
                    // Create Stripe customer
                    const stripeCustomer = yield stripe.customers.create({
                        name: name,
                        email: email,
                        // Add more customer details as needed
                    });
                    // Update user with Stripe customer ID
                    newUser.stripeCustomerId = stripeCustomer.id;
                    yield newUser.save();
                    // Generate JWT token
                    const token = jsonwebtoken_1.default.sign({ userID: newUser._id }, process.env.JWT_SECRET_KEY || '', { expiresIn: '30d' });
                    res.status(201).json({
                        status: 'success',
                        message: 'Registered successfully',
                        token,
                    });
                }
                else {
                    res
                        .status(400)
                        .json({ status: 'failed', message: 'Passwords are not matching' });
                }
            }
            else {
                res
                    .status(400)
                    .json({ status: 'failed', message: 'All fields are required' });
            }
        }
        catch (error) {
            res
                .status(500)
                .json({ status: 'failed', message: 'Unable to register', error });
        }
    });
}
exports.userReg = userReg;
//update user profile
function updateUserProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { authorization } = req.headers;
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
        if (!token) {
            res.status(401).json({ status: 'failed', message: 'No token provided' });
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        // Extract user ID from decoded token
        const userId = decodedToken.userID;
        const { name, email, phone, address } = req.body;
        try {
            const user = yield user_model_1.UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ status: 'failed', message: 'User not found' });
                return;
            }
            // Conditional updates based on provided fields
            if (name)
                user.name = name;
            if (phone)
                user.phone = phone;
            if (address)
                user.address = address;
            // Check if new email is provided and it's different from current
            if (email && user.email !== email) {
                const emailExists = yield user_model_1.UserModel.findOne({ email });
                if (emailExists) {
                    res
                        .status(400)
                        .json({ status: 'failed', message: 'Email already in use' });
                    return;
                }
                user.email = email;
            }
            yield user.save();
            res
                .status(200)
                .json({ status: 'success', message: 'Profile updated successfully' });
        }
        catch (error) {
            res
                .status(500)
                .json({ status: 'failed', message: 'Error updating profile', error });
        }
    });
}
exports.updateUserProfile = updateUserProfile;
//view cars of user
function viewCarsOfUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { authorization } = req.headers;
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
        if (!token) {
            res.status(401).json({ status: 'failed', message: 'No token provided' });
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decodedToken.userID;
        try {
            const cars = yield car_model_1.default.find({ user: userId });
            res.json(cars);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
}
exports.viewCarsOfUser = viewCarsOfUser;
//get user data
function getuserdatafromid(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { authorization } = req.headers;
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        try {
            // Verify the token
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
            const userId = decodedToken.userID;
            // Check if userId is a valid ObjectId
            if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                res.status(400).json({ error: 'Invalid user ID' });
                return;
            }
            const user = yield user_model_1.UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            // Send user data in the response
            res.json(user);
        }
        catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.getuserdatafromid = getuserdatafromid;
