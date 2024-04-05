"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bid_controller_1 = __importDefault(require("../controllers/bid.controller"));
const router = express_1.default.Router();
router.post('/bids/:carId', bid_controller_1.default.addBid);
router.get('/bids/:carId', bid_controller_1.default.getAllBids);
router.get('/bids/getMaxBid/:carId', bid_controller_1.default.getMaxBid);
router.get('/bids/userBidHistory/:userId', bid_controller_1.default.userBidHistory);
exports.default = router;
