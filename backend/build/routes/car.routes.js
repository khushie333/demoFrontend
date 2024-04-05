"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const car_controller_1 = __importDefault(require("../controllers/car.controller"));
const car_controller_2 = require("../controllers/car.controller");
const router = express_1.default.Router();
router.post('/car', car_controller_2.upload, car_controller_1.default.createCar);
router.get('/car', car_controller_1.default.getAllCars);
router.get('/car/:id', car_controller_1.default.getSingleCarById);
router.delete('/car/:id', car_controller_1.default.deleteCarById);
router.put('/car/:id', car_controller_2.upload, car_controller_1.default.updateCarById);
router.get('/cars', car_controller_1.default.search);
router.get('/carFilter', car_controller_1.default.filterByBaseAmount);
exports.default = router;
