"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const carSchema = new mongoose_1.Schema({
    user: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    Model: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    images: { type: [String] },
    baseAmount: {
        type: Number,
        required: true,
    },
    bidStartDate: {
        type: Date,
        required: true,
    },
    bidEndDate: {
        type: Date,
        required: true,
    },
});
exports.carModel = mongoose_1.default.model('car', carSchema);
exports.default = exports.carModel;
