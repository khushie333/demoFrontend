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
const emailConf_1 = __importDefault(require("../../config/emailConf"));
class ResetPasswordEmail {
}
_a = ResetPasswordEmail;
ResetPasswordEmail.sendUserPassResetEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (email) {
            const user = yield user_model_1.default.findOne({ email: email });
            if (user) {
                const secret = user._id + process.env.JWT_SECRET_KEY;
                const token = jsonwebtoken_1.default.sign({ userID: user._id }, secret, {
                    expiresIn: '15m',
                });
                const link = `http://localhost:5000/api/ResetPassword/${user._id}/${token}`;
                // Send email
                const info = yield emailConf_1.default.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: user.email,
                    subject: 'Password reset link',
                    html: `<h2><a>${link}</a></h2>`,
                });
                res.status(201).send({
                    status: 'success',
                    message: 'Please check your email to reset password',
                    info: info,
                });
            }
            else {
                res.send({ status: 'failed', message: 'Email does not exist' });
            }
        }
        else {
            res.send({ status: 'failed', message: 'Email is required' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'failed',
            message: 'Unable to send reset password email',
        });
    }
});
ResetPasswordEmail.userPassReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, password_conf, } = req.body;
        const { id, token } = req.params;
        const user = yield user_model_1.default.findById(id);
        if (!user) {
            res.status(404).send({ status: 'failed', message: 'User not found' });
            return;
        }
        const new_secret = user._id + process.env.JWT_SECRET_KEY;
        jsonwebtoken_1.default.verify(token, new_secret);
        if (!password || !password_conf) {
            res.send({ status: 'failed', message: 'Both fields are required' });
            return;
        }
        if (password !== password_conf) {
            res.send({ status: 'failed', message: 'Passwords do not match' });
            return;
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const newhashPassword = yield bcrypt_1.default.hash(password, salt);
        yield user_model_1.default.findByIdAndUpdate(user._id, {
            $set: {
                password: newhashPassword,
            },
        });
        res.status(201).send({
            status: 'success',
            message: 'Successfully changed password',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'failed',
            message: 'Invalid token or unable to reset password',
        });
    }
});
exports.default = ResetPasswordEmail;
