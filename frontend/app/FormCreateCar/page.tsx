'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { addCar } from '@/app/lib/UserSlice/UserSlice'
import { getCookie } from 'cookies-next'

interface FormValues {
	brand: string
	Model: string
	desc: string
	owner: string
	images: File
	baseAmount: number
	bidStartDate: Date
	bidEndDate: Date
}

const FormCreateCar = (event: React.FormEvent<HTMLFormElement>) => {
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const router = useRouter()
	const [files, setFiles] = useState<File | null>(null)
	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
		event
	) => {
		event.preventDefault()
		const token = getCookie('token') as string

		const formData = new FormData(event.currentTarget) // Get form data from event

		if (files) {
			formData.append('images', files) // Append the file if it exists
		}

		const val: FormValues = {
			brand: formData.get('brand') as string,
			Model: formData.get('Model') as string,
			desc: formData.get('desc') as string,
			owner: formData.get('owner') as string,
			images: files as File,
			baseAmount: parseInt(formData.get('baseAmount') as string), // Parse phone as number
			bidStartDate: new Date(formData.get('bidStartDate') as string),
			bidEndDate: new Date(formData.get('bidEndDate') as string),
		}
		console.log('data::', val)
		console.log('token::', token)
		try {
			const rsp = await dispatch(addCar({ data: val, token }))

			if (rsp.payload) {
				setTimeout(() => {
					router.replace('/')
				}, 200)
			} else {
				throw new Error('Invalid authentication')
			}
		} catch (error: any) {
			console.error('Login error:', error.message)
		}
	}
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// const uploadedFiles = e.target.files?.[0]
		const uploadedFiles = e.currentTarget.files?.[0]

		if (uploadedFiles) {
			setFiles(uploadedFiles)
		}
	}
	return (
		<div className=' flex flex-col justify-center min-h-screen overflow-hidden'>
			<div className='w-full p-6 m-auto bg-white rounded-md shadow-xl mt-36 shadow-blue-300 ring-2 ring-blue-700 lg:max-w-xl'>
				<h1 className='text-1xl font-semibold text-center text-blue-700  underline uppercase '>
					Add Car
				</h1>
				<form
					className='mt-6'
					method='post'
					onSubmit={handleSubmit}
					encType='multipart/form-data'
				>
					<div className='mb-2'>
						<label
							htmlFor='brand'
							className='block text-sm font-semibold text-gray-800'
						>
							brand
						</label>
						<input
							name='brand'
							type='text'
							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
						/>
					</div>

					<div className='mb-2'>
						<label
							htmlFor='Model'
							className='block text-sm font-semibold text-gray-800'
						>
							Model
						</label>
						<input
							name='Model'
							type='text'
							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
						/>
					</div>
					<div className='mb-2'>
						<label
							htmlFor='desc'
							className='block text-sm font-semibold text-gray-800'
						>
							Discription
						</label>
						<input
							type='text'
							name='desc'
							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
						/>
					</div>
					<div className='mb-2'>
						<label
							htmlFor='owner'
							className='block text-sm font-semibold text-gray-800'
						>
							owner
						</label>
						<input
							type='text'
							name='owner'
							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
						/>
					</div>
					<div className='mb-2'>
						<label
							htmlFor='images'
							className='block text-sm font-semibold text-gray-800'
						>
							images
						</label>
						<input
							type='file'
							name='images'
							onChange={handleFileChange}
							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
							multiple
						/>
					</div>
					<div className='mb-2'>
						<label
							htmlFor='baseAmount'
							className='block text-sm font-semibold text-gray-800'
						>
							baseAmount
						</label>
						<input
							type='number'
							name='baseAmount'
							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
						/>
					</div>
					<div className='mb-2'>
						<label
							htmlFor='bidStartDate'
							className='block text-sm font-semibold text-gray-800'
						>
							bid Start Date
						</label>
						<input
							type='date'
							name='bidStartDate'
							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
						/>
					</div>
					<div className='mb-2'>
						<label
							htmlFor='bidEndDate'
							className='block text-sm font-semibold text-gray-800'
						>
							bid End Date
						</label>
						<input
							type='date'
							name='bidEndDate'
							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
						/>
					</div>
					<div className='mt-6'>
						<button
							type='submit'
							className='w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transhtmlForm bg-blue-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600'
						>
							Add Car
						</button>
					</div>
				</form>
			</div>
			<br />
		</div>
	)
}

export default FormCreateCar
