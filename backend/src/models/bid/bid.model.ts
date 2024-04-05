import mongoose, { Schema, Document, Model } from 'mongoose'

export interface Bid extends Document {
	car: mongoose.Types.ObjectId
	user: mongoose.Types.ObjectId
	amount: number
	createdAt: Date
	updatedAt: Date
}

const bidSchema: Schema<Bid> = new Schema(
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
		amount: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
)

export const bidModel: Model<Bid> = mongoose.model<Bid>('Bid', bidSchema)

export default bidModel
