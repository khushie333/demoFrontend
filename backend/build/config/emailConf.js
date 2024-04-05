"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST || '',
    port: parseInt(process.env.EMAIL_PORT || '0', 10),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER || '', //admin id
        pass: process.env.EMAIL_PASS || '', //admin pass
    },
});
exports.default = transporter;
