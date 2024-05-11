'use client'
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import updateprofile from '@/utils/UpdateProfile'
import { updateUserProfile } from '@/app/lib/UserSlice/UserSlice'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { getCookie } from 'cookies-next'

interface FormValues {
	name: string
	email: string
	phone: number
	address: string
}

const UpdateUserProfile = () => {
	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const router = useRouter()
	const [submitting, setSubmitting] = useState(false)
	const token = getCookie('token') as string
	useEffect(() => {
		;(async () => {
			try {
				const response = await fetch(`${BASE_URL}/loggedinuser`, {
					credentials: 'include',
				})
				const content = await response.json()
				formik.setValues({
					name: content.name,
					email: content.email,
					phone: content.phone,
					address: content.address,
				})
			} catch (e) {
				console.log(e)
			}
		})()
	}, [])

	const formik = useFormik({
		initialValues: {
			name: '',
			email: '',
			phone: 0,
			address: '',
		},
		validationSchema: updateprofile,
		onSubmit: async (values: FormValues) => {
			setSubmitting(true)
			try {
				const rsp = await dispatch(updateUserProfile({ data: values, token }))
				if (rsp.payload !== undefined) {
					resetFormFields()
					setTimeout(() => {
						router.replace('/UserHome')
					}, 200)
				}
			} catch (error) {
				console.error(error)
			} finally {
				setSubmitting(false)
			}
		},
	})
	const resetFormFields = () => {
		formik.setValues({
			name: '',
			email: '',
			phone: 0,
			address: '',
		})
		formik.setTouched({
			name: false,
			email: false,
			phone: false,
			address: false,
		})
		formik.setErrors({
			name: '',
			email: '',
			phone: '',
			address: '',
		})
	}
	return (
		<form method='put' onSubmit={formik.handleSubmit}>
			<div className='mb-2'>
				<label
					htmlFor='name'
					className='block text-sm font-semibold text-gray-800'
				>
					Name
				</label>
				<input
					name='name'
					type='text'
					onChange={(val) => {
						formik.handleChange(val)
					}}
					value={formik.values.name}
					className='block w-96 px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
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
					value={formik.values.email}
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
					value={formik.values.phone}
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
				<textarea
					name='address'
					onChange={(val) => {
						formik.handleChange(val)
					}}
					value={formik.values.address}
					className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
				/>
				{formik.touched.address && formik.errors.address && (
					<p className='mt-2 text-sm text-red-600 dark:text-red-500'>
						<span className='font-medium'>{formik.errors.address}</span>
					</p>
				)}
			</div>

			<div className='mt-6'>
				<button
					type='submit'
					className='w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transhtmlForm bg-blue-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600'
				>
					Update
				</button>
			</div>
		</form>
	)
}

export default UpdateUserProfile
