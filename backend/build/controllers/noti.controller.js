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
exports.deleteNotificationById = exports.getnotificationByUserId = void 0;
const noti_model_1 = __importDefault(require("../models/notification/noti.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//get notfication by userid
function getnotificationByUserId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const notifications = yield noti_model_1.default.find({ user: userID });
            res.status(200).json(notifications);
        }
        catch (error) {
            res
                .status(500)
                .json({ message: 'Error fetching notifications for user', error });
        }
    });
}
exports.getnotificationByUserId = getnotificationByUserId;
//Delete notification by id
function deleteNotificationById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const notificationId = req.params.id;
            const deletedNotification = yield noti_model_1.default.findByIdAndDelete(notificationId);
            if (!deletedNotification) {
                res.status(404).json({ message: 'Notification not found' });
                return;
            }
            res.status(200).json({
                message: 'Notification deleted successfully',
                deletedNotification,
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Error deleting notification', error });
        }
    });
}
exports.deleteNotificationById = deleteNotificationById;
