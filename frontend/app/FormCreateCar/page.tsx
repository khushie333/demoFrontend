'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { addCar } from '@/app/lib/UserSlice/UserSlice'
import { getCookie } from 'cookies-next'
import HandleNotLoggedIn from '@/components/HandleNotLoggedIn'

interface FormValues {
	brand: string
	Model: string
	desc: string
	owner: string
	images: File[]
	baseAmount: number
	bidStartDate: Date
	bidEndDate: Date
}

const FormCreateCar = (event: React.FormEvent<HTMLFormElement>) => {
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const router = useRouter()
	const [jwt, setjwt] = useState('')

	useEffect(() => {
		const token = getCookie('token')
		if (token) {
			setjwt(token)
		}
	}, [jwt])
	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
		event
	) => {
		event.preventDefault()
		const token = getCookie('token') as string

		const formData = new FormData(event.currentTarget) // Get form data from event

		const val: FormValues = {
			brand: formData.get('brand') as string,
			Model: formData.get('Model') as string,
			desc: formData.get('desc') as string,
			owner: formData.get('owner') as string,
			images: formData.getAll('images') as File[],
			baseAmount: parseInt(formData.get('baseAmount') as string), // Parse phone as number
			bidStartDate: new Date(formData.get('bidStartDate') as string),
			bidEndDate: new Date(formData.get('bidEndDate') as string),
		}

		try {
			const rsp = await dispatch(addCar({ data: val, token }))

			if (rsp.payload) {
				setTimeout(() => {
					router.replace('/')
					alert('Your car will be added for auction when Admin approves it!')
				}, 200)
			} else {
				throw new Error('Invalid authentication')
			}
		} catch (error: any) {
			console.error('Login error:', error.message)
		}
	}

	return (
		<>
			{jwt?.length !== 0 && (
				<div className=' flex flex-col justify-center min-h-screen overflow-hidden'>
					<div className='w-full p-6 m-auto  bg-white rounded-md shadow-xl mt-44 shadow-blue-300 ring-2 ring-blue-700 lg:max-w-3xl'>
						<div>
							<h1 className='text-1xl font-semibold text-center text-blue-700  underline uppercase '>
								Add Car
							</h1>
						</div>
						<div>
							<form
								className='mt-6 flex flex-col'
								method='post'
								onSubmit={handleSubmit}
								encType='multipart/form-data'
							>
								<div className='flex flex-row gap-5'>
									<div>
										<div className='mb-2'>
											<label
												htmlFor='brand'
												className='block text-sm font-semibold text-gray-800'
											>
												Brand
											</label>
											<input
												name='brand'
												type='text'
												className='block w-80 px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
												required
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
												required
											/>
										</div>
										<div className='mb-2'>
											<label
												htmlFor='desc'
												className='block text-sm font-semibold text-gray-800'
											>
												Discription
											</label>
											<textarea
												name='desc'
												className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
												required
											/>
										</div>
										<div className='mb-2'>
											<label
												htmlFor='owner'
												className='block text-sm font-semibold text-gray-800'
											>
												Owner
											</label>
											<input
												type='text'
												name='owner'
												className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
												required
											/>
										</div>
									</div>
									<div>
										<div className='mb-2'>
											<label
												htmlFor='images'
												className='block text-sm font-semibold text-gray-800'
											>
												Images
											</label>
											<input
												type='file'
												name='images'
												className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
												multiple
												required
											/>
										</div>
										<div className='mb-2'>
											<label
												htmlFor='baseAmount'
												className='block text-sm font-semibold text-gray-800'
											>
												BaseAmount
											</label>
											<input
												type='number'
												name='baseAmount'
												className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
												required
											/>
										</div>
										<div className='mb-2'>
											<label
												htmlFor='bidStartDate'
												className='block text-sm font-semibold text-gray-800'
											>
												Bid Start Date
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
												Bid End Date
											</label>
											<input
												type='date'
												name='bidEndDate'
												className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
												required
											/>
										</div>
									</div>
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
					</div>
					<br />
					<div className='hero__image-container'>
						<div className='hero__image-overlay' />
					</div>
				</div>
			)}
			{jwt?.length === 0 && <HandleNotLoggedIn />}
		</>
	)
}

export default FormCreateCar
