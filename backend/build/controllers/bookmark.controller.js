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
exports.removeBookmark = exports.getBookmarkedCarsByUser = exports.bookmarkCar = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bookmark_model_1 = __importDefault(require("../models/bookmarks/bookmark.model"));
//create bookmark
const bookmarkCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        // Extract user ID from decoded token
        const userId = decodedToken.userID;
        const { carId } = req.params;
        // Check if the bookmark already exists
        const existingBookmark = yield bookmark_model_1.default.findOne({
            user: userId,
            car: carId,
        });
        if (existingBookmark) {
            res.status(400).json({ message: 'Bookmark already exists' });
            return;
        }
        const bookmark = new bookmark_model_1.default({
            user: userId,
            car: carId,
        });
        yield bookmark.save();
        res.status(201).json(bookmark);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.bookmarkCar = bookmarkCar;
//get all bookmark
const getBookmarkedCarsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Find all bookmarks for the specified user
        const bookmarks = yield bookmark_model_1.default.find({ user: userId });
        res.json({ bookmarks });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getBookmarkedCarsByUser = getBookmarkedCarsByUser;
//remove bookmark
const removeBookmark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        // Extract user ID from decoded token
        const userId = decodedToken.userID;
        const { carId } = req.params;
        // Remove the bookmark for the specified user and car
        yield bookmark_model_1.default.deleteOne({ user: userId, car: carId });
        res.json({ message: 'Bookmark removed successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.removeBookmark = removeBookmark;
