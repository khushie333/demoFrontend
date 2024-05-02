import express from 'express'

import {
	deleteNotificationById,
	getnotificationByUserId,
} from '../controllers/noti.controller'

const router = express.Router()

// Route to get notifications by user ID
router.get('/notifications/user', getnotificationByUserId)

// Route to delete a notification by ID
router.delete('/notifications/:id', deleteNotificationById)

export default router
