import * as Yup from 'yup'

const updateProfile = Yup.object().shape({
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
})

export default updateProfile
