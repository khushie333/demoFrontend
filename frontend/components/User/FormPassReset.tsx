'use client'
import React, { useState } from 'react'
import { useFormik } from 'formik'
import { updateUserPassword } from '@/app/lib/UserSlice/UserSlice'
import { useDispatch } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'
import SignIn from './SignIn'
import Link from 'next/link'
import userRegisterValidation from '@/utils/UserValidation'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { getCookie } from 'cookies-next'

interface FormValues {
	password: string
	password_conf: string
}

const FormPassReset = () => {
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const router = useRouter()
	const [submitting, setSubmitting] = useState(false)

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
		event
	) => {
		event.preventDefault()
		const token = getCookie('token') as string
		const formData = new FormData(event.currentTarget) // Get form data from event

		const val: FormValues = {
			password: formData.get('password') as string,
			password_conf: formData.get('password_conf') as string,
		}
		try {
			const rsp = await dispatch(updateUserPassword({ data: val, token }))
			if (rsp.payload !== undefined) {
				setTimeout(async () => {
					router.replace('/SignIn')
				}, 200)
			}
		} catch (error) {
			throw error
		} finally {
			setSubmitting(false)
		}
	}
	return (
		<div>
			<form className='mt-6' method='post' onSubmit={handleSubmit}>
				<div className='mb-4'>
					<label
						htmlFor='password'
						className='block text-sm font-semibold text-gray-800'
					>
						Password
					</label>
					<input
						type='password'
						name='password'
						className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
					/>
				</div>
				<div className='mb-4'>
					<label
						htmlFor='password_conf'
						className='block text-sm font-semibold text-gray-800'
					>
						Confirm Password
					</label>
					<input
						type='password_conf'
						name='password_conf'
						className='block px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
					/>
				</div>
				<button
					type='submit'
					className='w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transhtmlForm bg-blue-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600'
				>
					Reset Password
				</button>{' '}
			</form>
		</div>
	)
}

export default FormPassReset
