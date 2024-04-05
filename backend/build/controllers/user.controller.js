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
exports.userReg = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user/user.model");
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
function userReg(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, phone, address, password, password_conf, active } = req.body;
        try {
            // Checking email duplication
            //console.log(req.body)
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
                    yield newUser.save();
                    // Get saved user
                    const savedUser = yield user_model_1.UserModel.findOne({ email });
                    if (!savedUser) {
                        throw new Error('User not found after saving');
                    }
                    // Generate JWT token
                    const token = jsonwebtoken_1.default.sign({ userID: savedUser._id }, process.env.JWT_SECRET_KEY || '', { expiresIn: '30d' });
                    res.status(201).json({
                        status: 'success',
                        message: 'Records inserted successfully',
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
