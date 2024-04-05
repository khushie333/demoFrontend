"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_middleware_1 = __importDefault(require("../middlewares/authenticate.middleware"));
const login_controller_1 = __importDefault(require("../controllers/authentication/login.controller"));
//import ResetPasswordEmail from '../controllers/authentication/resetpasswordemail.controller'
const router = (0, express_1.Router)();
// Define routes
router.post('/login', login_controller_1.default.userLogin);
router.post('/changepassword', authenticate_middleware_1.default, login_controller_1.default.changePassword);
exports.default = router;
