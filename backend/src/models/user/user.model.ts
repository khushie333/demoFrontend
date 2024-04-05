import mongoose, { Schema, Document, Model } from 'mongoose'

export interface User extends Document {
	name: string
	email: string
	phone: string
	address: string
	password: string
	active: boolean // Optional field
}

const userSchema: Schema<User> = new Schema<User>({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true, // Ensure unique emails
		validate: {
			validator: (value: string) => {
				// Validate email format
				return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
			},
			message: 'Invalid email',
		},
	},
	phone: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	active: {
		type: Boolean,
		default: false, // Set default value to false
	},
})

// Define and export user model
export const UserModel: Model<User> = mongoose.model<User>('user', userSchema)

export default UserModel
