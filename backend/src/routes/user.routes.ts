import express from 'express'
import { getUsers, userReg } from '../controllers/user.controller'
import {
	bookmarkCar,
	getBookmarkedCarsByUser,
	removeBookmark,
} from '../controllers/bookmark.controller'

const router = express.Router()

// Define routes
router.get('/user', getUsers)
router.post('/user', userReg)
//user operations
//bookmark car
router.post('/bookmarks/:carId', bookmarkCar)
router.get('/bookmarks/:userId', getBookmarkedCarsByUser)
router.delete('/bookmarks/:carId', removeBookmark)

// Export the router
export default router
