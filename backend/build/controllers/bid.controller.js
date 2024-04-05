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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bid_model_1 = require("../models/bid/bid.model");
class bidController {
}
_a = bidController;
//add bid by user
bidController.addBid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        const token = authorization.split(' ')[1];
        const { userID } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const { carId } = req.params;
        const { amount } = req.body;
        const bid = new bid_model_1.bidModel({
            car: carId,
            user: userID,
            amount,
        });
        yield bid.save();
        res.status(201).json(bid);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//get all bids on specific car
bidController.getAllBids = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carId } = req.params;
        const bids = yield bid_model_1.bidModel.find({ car: carId });
        res.json({ bids });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//get Max Bid on specific car
bidController.getMaxBid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carId } = req.params;
        // Find the maximum bid for the specified car
        const maxBid = yield bid_model_1.bidModel
            .findOne({ car: carId })
            .sort({ amount: -1 })
            .limit(1);
        if (!maxBid) {
            res
                .status(404)
                .json({ message: 'No bids found for the specified car.' });
            return;
        }
        res.json({ maxBidAmount: maxBid.amount });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//get all the bids by a specific user
bidController.userBidHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const userIdFromToken = decodedToken.userID;
        const { userId } = req.params;
        // Check if the requested user ID matches the user ID from the token
        if (userId !== userIdFromToken) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        const bids = yield bid_model_1.bidModel.find({ user: userId });
        res.json({ bids });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = bidController;
