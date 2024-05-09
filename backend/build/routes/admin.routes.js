"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
const router = (0, express_1.Router)();
router.get('/user/car/:userID', admin_controller_1.default.viewCarsbyUserId);
router.post('/admin/isApproved/:carId', admin_controller_1.default.approveCar);
router.post('/admin/disApproved/:carId', admin_controller_1.default.disapproveCar);
router.get('/admin/newcars', admin_controller_1.default.ViewNewCar);
router.put('/admin/:userId', admin_controller_1.default.deactivateUserHandler);
router.put('/admin/activate/:userId', admin_controller_1.default.activateUserHandler);
exports.default = router;
