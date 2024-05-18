'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { updateCar } from '@/app/lib/UserSlice/UserSlice'
import { getCookie } from 'cookies-next'
import HandleNotLoggedIn from '@/components/HandleNotLoggedIn'

interface Car {
	_id: string
	images: File
	brand: string
	Model: string
	desc: string
	owner: string
	baseAmount: number
	bidStartDate: Date
	bidEndDate: Date
	deleted: boolean
}

const UpdateCarData = () => {
	const parts = window.location.href.split('/')
	const carID = parts[4]
	// console.log(carID)
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const router = useRouter()
	const [files, setFiles] = useState<FileList | null>(null)
	const [jwt, setjwt] = useState('')
	const [cars, setCars] = useState<Car[]>([])
	const token = getCookie('token')
	const role = getCookie('role')
	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

	useEffect(() => {
		if (token) {
			setjwt(token)
		}
	}, [jwt])
	useEffect(() => {
		const fetchCars = async () => {
			try {
				const response = await axios.get(`${BASE_URL}/user/viewCarsOfUser`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				setCars(response.data)
			} catch (error) {
				console.error('Error fetching cars', error)
			}
		}

		if (carID) {
			fetchCars()
		}
	}, [carID, token])
	const filteredCars = cars.filter((car) => car._id === carID) || {}
	const formik = useFormik({
		initialValues: {
			brand: filteredCars[0]?.brand || '',
			Model: filteredCars[0]?.Model || '',
			desc: filteredCars[0]?.desc || '',
			owner: filteredCars[0]?.owner || '',
			baseAmount: filteredCars[0]?.baseAmount || 0,
			bidStartDate: filteredCars[0]?.bidStartDate
				? new Date(filteredCars[0].bidStartDate).toISOString().substring(0, 10)
				: '',
			bidEndDate: filteredCars[0]?.bidEndDate
				? new Date(filteredCars[0].bidEndDate).toISOString().substring(0, 10)
				: '',
		},
		enableReinitialize: true, // Important to update form values when cars state updates
		onSubmit: async (values: any) => {
			const formData = new FormData()
			Object.entries(values).forEach(([key, value]) => {
				formData.append(key, String(value))
			})
			if (files) {
				for (let i = 0; i < files.length; i++) {
					formData.append('images', files[i])
				}
			}
			try {
				const rsp = await dispatch(updateCar({ carID, data: formData, token }))

				if (rsp.payload) {
					router.replace('/ViewCars')
				} else {
					throw new Error('Update failed')
				}
			} catch (error) {
				console.error('Update error:', error)
			}
		},
	})
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const uploadedFiles = e.target.files
		if (uploadedFiles) {
			setFiles(uploadedFiles)
		}
	}
	return (
		<>
			{role === 'user' && (
				<div className='relative flex flex-col justify-center min-h-screen overflow-hidden'>
					<div className='w-full p-6 m-auto mt-44 mb-10 bg-white rounded-md shadow-xl shadow-blue-300 ring-2 ring-blue-700 lg:max-w-xl'>
						<h1 className='text-1xl font-semibold text-center text-blue-700  underline uppercase '>
							Update car
						</h1>
						<form
							className='mt-6 flex flex-col'
							method='post'
							onSubmit={formik.handleSubmit}
							encType='multipart/form-data'
						>
							<div className='flex flex-row gap-5'>
								<div>
									<div className='mb-2'>
										<label
											htmlFor='brand'
											className='block text-sm font-semibold text-gray-800'
										>
											brand
										</label>
										<input
											required
											name='brand'
											type='text'
											onChange={formik.handleChange}
											value={formik.values.brand}
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
											required
											name='Model'
											type='text'
											onChange={formik.handleChange}
											value={formik.values.Model}
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
											required
											type='text'
											name='desc'
											onChange={formik.handleChange}
											value={formik.values.desc}
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
											required
											type='text'
											name='owner'
											onChange={formik.handleChange}
											value={formik.values.owner}
											className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
										/>
									</div>
								</div>
								<div>
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
											required
											type='number'
											name='baseAmount'
											onChange={formik.handleChange}
											value={formik.values.baseAmount}
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
											required
											type='date'
											name='bidStartDate'
											onChange={formik.handleChange}
											value={formik.values.bidStartDate}
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
											required
											type='date'
											name='bidEndDate'
											onChange={formik.handleChange}
											value={formik.values.bidEndDate}
											className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
										/>
									</div>
								</div>
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
					</div>
					<div className='hero__image-container'>
						<div className='hero__image-overlay' />
					</div>
				</div>
			)}
			{jwt?.length === 0 && <HandleNotLoggedIn />}
		</>
	)
}

export default UpdateCarData
