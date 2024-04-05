import mongoose, { Schema, Document, Model } from 'mongoose'

export interface Bookmark extends Document {
	user: mongoose.Types.ObjectId
	car: mongoose.Types.ObjectId
}

const bookmarkSchema: Schema<Bookmark> = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		car: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Car',
			required: true,
		},
	},
	{ timestamps: true }
)

const bookmarkModel: Model<Bookmark> = mongoose.model<Bookmark>(
	'Bookmark',
	bookmarkSchema
)

export default bookmarkModel
