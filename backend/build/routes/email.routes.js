"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resetpasswordemail_controller_1 = __importDefault(require("../controllers/authentication/resetpasswordemail.controller"));
const router = (0, express_1.Router)();
router.post('/sendResetPassword', resetpasswordemail_controller_1.default.sendUserPassResetEmail);
router.post('/ResetPassword/:id/:token', resetpasswordemail_controller_1.default.userPassReset);
exports.default = router;
