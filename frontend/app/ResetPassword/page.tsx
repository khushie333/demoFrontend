'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { ToastSuccess } from '@/components/ToastContainer'

const RequestReset = () => {
	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

	const [email, setEmail] = useState('')
	const [message, setMessage] = useState('')

	const handleSubmit = async (event: any) => {
		event.preventDefault()
		try {
			const response = await axios.post(`${BASE_URL}/sendResetPassword`, {
				email,
			})
			ToastSuccess(response.data.message)
		} catch (error) {
			console.error('Reset email error:', error)
			setMessage('Failed to send reset email.')
		}
	}

	return (
		<div className='relative flex flex-col justify-center min-h-screen overflow-hidden'>
			<div className='w-full p-6 m-auto mt-56 bg-white rounded-md shadow-xl shadow-blue-300 ring-2 ring-blue-700 lg:max-w-xl'>
				<h1 className='text-2xl font-semibold text-center text-blue-700 underline uppercase'>
					Request Password Reset
				</h1>
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label
							htmlFor='email'
							className='block text-sm font-semibold text-gray-800'
						>
							Email
						</label>
						<input
							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder='Enter your email'
							required
						/>
					</div>
					<p className='mt-8 text-base font-light text-center text-gray-700'>
						<button
							className='font-medium text-indigo-600 text-center  hover:underline '
							type='submit'
						>
							Send Reset Link
						</button>
					</p>
				</form>
				{message && <p>{message}</p>}
			</div>
			<div className='hero__image-container'>
				<div className='hero__image-overlay' />
			</div>
		</div>
	)
}

export default RequestReset
