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
const stripeService_1 = __importDefault(require("./stripeService"));
//create  payment
function createpayment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { amount, customerId } = req.body;
            if (!amount || !customerId) {
                return res
                    .status(400)
                    .json({ error: 'Amount and Customer ID are required' });
            }
            const paymentIntent = yield (0, stripeService_1.default)(amount, customerId);
            res.status(200).json(paymentIntent);
        }
        catch (error) {
            console.log('error: ', error);
            res.status(500).json({ error });
        }
    });
}
exports.default = createpayment;
