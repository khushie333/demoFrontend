'use client'
import React, { useState } from 'react'
import { useFormik } from 'formik'
import { userRegister } from '@/app/lib/UserSlice/UserSlice'
import { useDispatch } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'
import SignIn from './SignIn'
import Link from 'next/link'
import userRegisterValidation from '@/utils/UserValidation'
import { ThunkDispatch } from '@reduxjs/toolkit'

interface FormValues {
	name: string
	email: string
	phone: number
	address: string
	password: string
	password_conf: string
}

export const Signup = () => {
	const [submitting, setSubmitting] = useState(false)

	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const router = useRouter()

	//register api call using dispatch

	const handleSubmit = async (val: FormValues) => {
		try {
			const rsp = await dispatch(userRegister(val))
			if (rsp.payload !== undefined) {
				setTimeout(async () => {
					router.replace('/')
				}, 200)
			}
		} catch (error) {
			throw error
		} finally {
			setSubmitting(false)
		}
	}

	const formik = useFormik({
		initialValues: {
			name: '',
			email: '',
			phone: 0,
			address: '',
			password: '',
			password_conf: '',
		},
		validationSchema: userRegisterValidation,
		onSubmit: handleSubmit,
	})

	return (
		<div className=' flex flex-col justify-center min-h-screen overflow-hidden'>
			<div className='w-full p-6 m-auto bg-white rounded-md shadow-xl mb-10 shadow-blue-300 ring-2 ring-blue-700 lg:max-w-xl'>
				<h1 className='text-3xl font-semibold text-center text-blue-700  underline uppercase '>
					Sign UP
				</h1>
				<form className='mt-6' method='post' onSubmit={formik.handleSubmit}>
					<div className='mb-2'>
						<label
							htmlFor='name'
							className='block text-sm font-semibold text-gray-800'
						>
							name
						</label>
						<input
							name='name'
							type='text'
							onChange={(val) => {
								formik.handleChange(val)
							}}
							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
						/>
						{formik.touched.name && formik.errors.name && (
							<p className='mt-2 text-sm text-red-600 dark:text-red-500'>
								<span className='font-medium'>{formik.errors.name}</span>
							</p>
						)}
					</div>

					<div className='mb-2'>
						<label
							htmlFor='email'
							className='block text-sm font-semibold text-gray-800'
						>
							Email
						</label>
						<input
							name='email'
							type='text'
							onChange={(val) => {
								formik.handleChange(val)
							}}
							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
						/>
						{formik.touched.email && formik.errors.email && (
							<p className='mt-2 text-sm text-red-600 dark:text-red-500'>
								<span className='font-medium'>{formik.errors.email}</span>
							</p>
						)}
					</div>
					<div className='mb-2'>
						<label
							htmlFor='phone'
							className='block text-sm font-semibold text-gray-800'
						>
							Contact Number
						</label>
						<input
							type='phone'
							name='phone'
							onChange={(val) => {
								formik.handleChange(val)
							}}
							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
						/>
						{formik.touched.phone && formik.errors.phone && (
							<p className='mt-2 text-sm text-red-600 dark:text-red-500'>
								<span className='font-medium'>{formik.errors.phone}</span>
							</p>
						)}
					</div>
					<div className='mb-2'>
						<label
							htmlFor='address'
							className='block text-sm font-semibold text-gray-800'
						>
							Address
						</label>
						<input
							type='address'
							name='address'
							onChange={(val) => {
								formik.handleChange(val)
							}}
							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
						/>
						{formik.touched.address && formik.errors.address && (
							<p className='mt-2 text-sm text-red-600 dark:text-red-500'>
								<span className='font-medium'>{formik.errors.address}</span>
							</p>
						)}
					</div>
					<div className='mb-2'>
						<label
							htmlFor='password'
							className='block text-sm font-semibold text-gray-800'
						>
							Password
						</label>
						<input
							type='password'
							name='password'
							onChange={(val) => {
								formik.handleChange(val)
							}}
							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
						/>
						{formik.touched.password && formik.errors.password && (
							<p className='mt-2 text-sm text-red-600 dark:text-red-500'>
								<span className='font-medium'>{formik.errors.password}</span>
							</p>
						)}
					</div>
					<div className='mb-2'>
						<label
							htmlFor='password_conf'
							className='block text-sm font-semibold text-gray-800'
						>
							Confirm Password
						</label>
						<input
							type='password'
							name='password_conf'
							onChange={(val) => {
								formik.handleChange(val)
							}}
							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
						/>
						{formik.touched.password_conf && formik.errors.password_conf && (
							<p className='mt-2 text-sm text-red-600 dark:text-red-500'>
								<span className='font-medium'>
									{formik.errors.password_conf}
								</span>
							</p>
						)}
					</div>
					<div className='mt-6'>
						<button
							type='submit'
							className='w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transhtmlForm bg-blue-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600'
						>
							Signup
						</button>
					</div>
				</form>

				<p className='mt-8 text-base font-light text-center text-gray-700'>
					{' '}
					Already have an account?{' '}
					<Link
						href={'/SignIn'}
						className='font-medium text-indigo-600 hover:underline'
					>
						Sign in
					</Link>
				</p>
			</div>
		</div>
	)
}

export default Signup
