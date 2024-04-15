import * as Yup from 'yup'

const userRegisterValidation = Yup.object().shape({
	name: Yup.string().required('Name is required'),
	email: Yup.string()
		.email('Invalid email address')
		.required('Email is required'),
	phone: Yup.number()
		.typeError('Phone must be a number')
		.positive('Phone must be a positive number')
		.integer('Phone must be an integer')
		.required('Phone is required'),
	address: Yup.string().required('Address is required'),
	password: Yup.string()
		.min(6, 'Password must be at least 6 characters')
		.required('Password is required'),
	password_conf: Yup.string()
		.oneOf([Yup.ref('password'), ''], 'Passwords must match')
		.required('Confirm Password is required'),
})

export default userRegisterValidation
