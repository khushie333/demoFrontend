'use client'
import React from 'react'
import UserSlice from '@/app/lib/UserSlice/UserSlice'
import { userLogin } from '@/app/lib/UserSlice/UserSlice'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { ToastContainer } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { getCookie } from 'cookies-next'
import { ThunkDispatch } from '@reduxjs/toolkit'

interface formValue {
	email: string
	password: string
}
const SignIn = () => {
	// const dispatch = useDispatch()
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const router = useRouter()

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
		event
	) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget) // Get form data from event
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

				setTimeout(() => {
					router.replace('/')
				}, 200)
			} else {
				throw new Error('Invalid authentication')
			}
		} catch (error: any) {
			console.error('Login error:', error.message)
		}
		console.log('value: ', val)
	}

	return (
		<div className='relative flex flex-col justify-center min-h-screen overflow-hidden'>
			<div className='w-full p-6 m-auto bg-white rounded-md shadow-xl shadow-blue-300 ring-2 ring-blue-700 lg:max-w-xl'>
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
			</div>
		</div>
	)
}

export default SignIn
