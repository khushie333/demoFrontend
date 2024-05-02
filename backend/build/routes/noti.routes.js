"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const noti_controller_1 = require("../controllers/noti.controller");
const router = express_1.default.Router();
// Route to get notifications by user ID
router.get('/notifications/user', noti_controller_1.getnotificationByUserId);
// Route to delete a notification by ID
router.delete('/notifications/:id', noti_controller_1.deleteNotificationById);
exports.default = router;
