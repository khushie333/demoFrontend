import mongoose, { Schema, Document, Model } from 'mongoose'

export interface notification extends Document {
	car: mongoose.Types.ObjectId
	user: mongoose.Types.ObjectId

	message: string
	isread: boolean
}

const notifications: Schema<notification> = new Schema(
	{
		car: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Car',
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},

		message: {
			type: String,
			required: true,
		},
		isread: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{ timestamps: true }
)

export const notificationmodel: Model<notification> =
	mongoose.model<notification>('notifications', notifications)

export default notificationmodel
