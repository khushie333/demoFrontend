"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const bookmark_controller_1 = require("../controllers/bookmark.controller");
//import { viewCarsbyUserId } from '../controllers/admin.controller'
const router = express_1.default.Router();
// Define routes
router.get('/user/getUserDatafromid', user_controller_1.getuserdatafromid);
router.get('/user', user_controller_1.getUsers);
router.post('/user', user_controller_1.userReg);
router.put('/user/profile', user_controller_1.updateUserProfile);
router.get('/user/viewCarsOfUser', user_controller_1.viewCarsOfUser);
router.get('/user/:userId', user_controller_1.getUsersById);
//user operations
//bookmark car
router.post('/bookmarks/:carId', bookmark_controller_1.bookmarkCar);
router.get('/bookmarks/user', bookmark_controller_1.getBookmarkedCarsByUser);
router.delete('/bookmarks/:carId', bookmark_controller_1.removeBookmark);
router.get('/bookmarks', bookmark_controller_1.getBookmarks);
// Export the router
exports.default = router;
