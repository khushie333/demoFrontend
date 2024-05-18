'use client'
import React from 'react'
import UserSlice from '@/app/lib/UserSlice/UserSlice'
import { userLogin } from '@/app/lib/UserSlice/UserSlice'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { ToastContainer } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { getCookie, setCookie } from 'cookies-next'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { motion } from 'framer-motion'

interface formValue {
	email: string
	password: string
}
const SignIn = () => {
	// const dispatch = useDispatch()
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const router = useRouter()
	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
		event
	) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const val: formValue = {
			email: formData.get('email') as string,
			password: formData.get('password') as string,
		}
		try {
			const rsp = await dispatch(userLogin(val))
			if (rsp.payload.status === 'success') {
				const token = getCookie('token')
				const message = getCookie('message')
				const status = getCookie('status')

				const response = await fetch(`${BASE_URL}/user/getUserDatafromid`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				if (response.ok) {
					const userData = await response.json()

					if (userData?.isAdmin) {
						// Redirect to admin dashboard
						router.replace('/Admin')
						setCookie('role', 'admin')
					} else {
						// Redirect to regular user dashboard
						router.replace('/')
						setCookie('role', 'user')
					}
				} else {
					console.error('Failed to fetch user data')
				}
			} else {
				throw new Error('Invalid authentication')
			}
		} catch (error: any) {
			console.error('Login error:', error.message)
		}
	}
	const MotionDiv = motion.div

	return (
		<div className='relative flex flex-col justify-center min-h-screen '>
			<div className='w-full p-6 m-auto bg-white rounded-md shadow-xl mt-56 shadow-blue-300 ring-2 ring-blue-700 lg:max-w-xl'>
				<h1 className='text-3xl font-semibold text-center text-blue-700 underline uppercase'>
					Sign In
				</h1>
				<form className='mt-6' method='post' onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label
							htmlFor='email'
							className='block text-sm font-semibold text-gray-800'
						>
							Email
						</label>
						<input
							type='email'
							name='email'
							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
							required
						/>
					</div>
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
							required
						/>
					</div>
					<div className='mt-6'>
						<button className='w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 bg-blue-700 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600'>
							Login
						</button>
					</div>
				</form>

				<p className='mt-8 text-base font-light text-center text-gray-700'>
					Don't have an account?{' '}
					<Link
						href={'/Signup'}
						className='font-medium text-indigo-600 hover:underline'
					>
						Sign up
					</Link>
				</p>

				<p className='mt-8 text-base font-light text-center text-gray-700'>
					<Link
						href={'/ResetPassword'}
						className='font-medium text-indigo-600 hover:underline'
					>
						Forgot password?
					</Link>
				</p>
			</div>
			<div className='hero__image-container'>
				<div className='hero__image-overlay' />
			</div>
		</div>
	)
}

export default SignIn
