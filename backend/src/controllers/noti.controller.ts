import { Request, Response } from 'express'
import notificationmodel from '../models/notification/noti.model'
import { Server as SocketIOServer } from 'socket.io'
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'

interface ProcessEnv {
	[key: string]: string
}

declare const process: {
	env: ProcessEnv
}

//get notfication by userid
export async function getnotificationByUserId(
	req: Request,
	res: Response
): Promise<void> {
	try {
		const authorization = req.headers.authorization

		if (!authorization) {
			res.status(401).send({ error: 'Unauthorized' })
			return
		}

		const token = authorization.split(' ')[1]

		if (!token) {
			res.status(401).send({ error: 'Unauthorized' })
			return
		}
		//	console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY)
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY) as Jwt &
			JwtPayload

		const userID = decodedToken.userID as string

		const notifications = await notificationmodel.find({ user: userID })

		res.status(200).json(notifications)
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Error fetching notifications for user', error })
	}
}

//Delete notification by id
export async function deleteNotificationById(
	req: Request,
	res: Response
): Promise<void> {
	try {
		const notificationId = req.params.id
		const deletedNotification = await notificationmodel.findByIdAndDelete(
			notificationId
		)

		if (!deletedNotification) {
			res.status(404).json({ message: 'Notification not found' })
			return
		}

		res.status(200).json({
			message: 'Notification deleted successfully',
			deletedNotification,
		})
	} catch (error) {
		res.status(500).json({ message: 'Error deleting notification', error })
	}
}
