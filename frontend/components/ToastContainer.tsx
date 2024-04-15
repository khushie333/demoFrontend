import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//custom hook create for toastify error and success message show component
export const ToastError = (error: any) => {
	return (
		<>
			{toast.error(error, {
				position: 'top-right',
				autoClose: 1500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'light',
			})}
		</>
	)
}

export const ToastSuccess = (message: any) => {
	return (
		<>
			{toast.success(message, {
				position: 'top-right',
				autoClose: 1500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'light',
			})}
		</>
	)
}

export default ToastContainer
