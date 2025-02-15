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
const car_model_1 = __importDefault(require("../models/car/car.model"));
const noti_model_1 = __importDefault(require("../models/notification/noti.model"));
const server_1 = require("../server");
const emailConf_1 = __importDefault(require("../config/emailConf"));
const user_model_1 = __importDefault(require("../models/user/user.model"));
class bidController {
}
_a = bidController;
//add bid by user
bidController.addBid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        const token = authorization.split(' ')[1];
        console.log(token);
        if (token === 'undefined') {
            res.status(500).send({ error: 'Not signed in' });
            console.log('Not signed in');
            return;
        }
        if (token.length !== 0) {
            const { userID } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
            const { carId } = req.params;
            if (carId) {
                const car = yield car_model_1.default.findById(carId);
                const baseamount = car === null || car === void 0 ? void 0 : car.baseAmount;
                const { amount } = req.body;
                if (baseamount && amount > baseamount) {
                    const bid = new bid_model_1.bidModel({
                        car: carId,
                        user: userID,
                        amount,
                    });
                    yield bid.save();
                    //io.emit('newBid', { bid: amount, carId, userID })
                    server_1.io.emit('bidReceived', {
                        message: `New bid of ${amount} placed on your car ${car.brand} ${car.Model} by user ${userID}`,
                        bidAmount: amount,
                        carId,
                        bidderId: userID,
                    });
                    yield noti_model_1.default.create({
                        car: carId,
                        user: car.user,
                        type: 'NewBid',
                        message: `New bid of ${amount} on your car ${car.brand} ${car.Model}`,
                        isRead: false,
                    });
                    res.status(201).json(bid);
                }
                else {
                    res
                        .status(500)
                        .send({ error: 'bid amount should be greater than baseAmount' });
                    console.log('baseamount error');
                }
            }
            else {
                console.log('error');
            }
        }
        else {
            res.send('Please LogIn first');
            console.log('token not provided');
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
        console.log(error);
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
//Delete a bid
bidController.deleteBid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        const token = authorization.split(' ')[1];
        if (token.length !== 0) {
            const { userID } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
            const { bidId } = req.params;
            // Delete the bid
            const bid = yield bid_model_1.bidModel.findById(bidId);
            if ((bid === null || bid === void 0 ? void 0 : bid.user.toString()) === userID) {
                const deleteBid = yield bid_model_1.bidModel.findByIdAndDelete(bidId);
                if (!deleteBid) {
                    res.status(404).json({ error: 'Bid not found' });
                    return;
                }
            }
            res.json({ message: 'Bid deleted successfully' });
        }
        else {
            res.send('Please LogIn first');
            console.log('token not provided');
        }
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
            // Respond with a custom status (200 OK) and a message indicating no bids found
            res.status(200).json({
                maxBidAmount: null,
                message: 'No bids found for the specified car.',
            });
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
//Finalize the bid by sending an email
bidController.bidFinalization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bidAmount, brand, Model, email, ownerEmail, ownerPhone, carID } = req.body;
        if (email) {
            const user = yield user_model_1.default.findOne({ email: email });
            const car = yield car_model_1.default.findById(carID);
            if (user && car) {
                const secret = user._id + process.env.JWT_SECRET_KEY;
                const token = jsonwebtoken_1.default.sign({ userID: user._id }, secret, {
                    expiresIn: 86400,
                });
                const link = `http://localhost:3000/CheckoutPage/${user._id}/${token}?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(Model)}&amount=${encodeURIComponent(bidAmount)}`;
                // Send email
                const info = yield emailConf_1.default.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: user.email,
                    subject: 'Bid has accepted',
                    html: `
                <h2>Bid Acceptance Notification</h2>
                <p>Your bid of ${bidAmount} has been accepted for the following car:</p>
                <ul>
                  <li>Brand: ${brand}</li>
                  <li>Model: ${Model}</li>

                </ul>
                <br/>
                <p>Contact details of the owner:</p>
                  <ul>
                  <li>Contact: ${ownerEmail}</li>
                  <li>Email: ${ownerPhone}</li>
                  <a href="${link}"> Click here for checkout </a>
                </ul>
                <p>Congrats! Thank you for your bid!</p>
              `,
                });
                car.deleted = true;
                yield car.save();
                res.status(201).send({
                    status: 'success',
                    message: 'Please check your email',
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
            message: 'Unable to send email',
        });
    }
});
exports.default = bidController;
