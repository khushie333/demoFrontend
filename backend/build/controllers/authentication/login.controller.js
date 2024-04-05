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
const user_model_1 = __importDefault(require("../../models/user/user.model")); // Assuming you have a User interface exported from User.js
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class loginController {
}
_a = loginController;
loginController.userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const user = yield user_model_1.default.findOne({ email: email });
            if (user !== null) {
                const isMatching = yield bcrypt_1.default.compare(password, user.password);
                if (user.email === email && isMatching) {
                    // JWT token
                    const token = jsonwebtoken_1.default.sign({ userID: user._id }, process.env.JWT_SECRET_KEY || '', { expiresIn: '30d' });
                    res.status(201).send({
                        status: 'success',
                        message: 'logged in successfully',
                        token: token,
                    });
                }
                else {
                    res.send({
                        status: 'failed',
                        message: 'username or password is wrong',
                    });
                }
            }
            else {
                res.send({ status: 'failed', message: 'not a registered user' });
            }
        }
        else {
            res.send({ status: 'failed', message: 'all fields are required' });
        }
    }
    catch (error) {
        res.send({
            status: 'failed',
            message: 'unable to login',
        });
    }
});
// change password
loginController.changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { password, password_conf, } = req.body;
    if (password && password_conf) {
        if (password !== password_conf) {
            res.send({
                status: 'failed',
                message: 'passwords not matching',
            });
        }
        else {
            const salt = yield bcrypt_1.default.genSalt(10);
            const newhashPassword = yield bcrypt_1.default.hash(password, salt);
            // console.log(req.body) // Check if the request body contains password and password_conf fields
            // console.log(req.user?._id) // Check if the user ID is correctly set
            // // Mongoose findByIdAndUpdate method call
            // console.log(`Updating password for user with ID: ${req.user?._id}`)
            // find by id and update the password
            const result = yield user_model_1.default.findByIdAndUpdate((_b = req.user) === null || _b === void 0 ? void 0 : _b._id, {
                $set: {
                    password: newhashPassword,
                },
            });
            res.status(201).send({
                status: 'success',
                message: 'successfully changed password',
            });
            //console.log(result)
        }
    }
    else {
        res.send({ status: 'failed', message: 'all fields are required' });
    }
});
exports.default = loginController;
