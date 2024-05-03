import express from 'express'
import {
	getUsers,
	userReg,
	updateUserProfile,
	viewCarsOfUser,
	getUsersById,
} from '../controllers/user.controller'
import {
	bookmarkCar,
	getBookmarkedCarsByUser,
	removeBookmark,
	getBookmarks,
} from '../controllers/bookmark.controller'

const router = express.Router()

// Define routes
router.get('/user', getUsers)
router.post('/user', userReg)
router.put('/user/profile', updateUserProfile)
router.get('/user/viewCarsOfUser', viewCarsOfUser)
router.get('/user/:userId', getUsersById)
//user operations
//bookmark car
router.post('/bookmarks/:carId', bookmarkCar)
router.get('/bookmarks/user', getBookmarkedCarsByUser)
router.delete('/bookmarks/:carId', removeBookmark)
router.get('/bookmarks', getBookmarks)

// Export the router
export default router
