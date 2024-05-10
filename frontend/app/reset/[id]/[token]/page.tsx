'use client'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ResetPassword = () => {
	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

	const parts = window.location.href.split('/')

	const id = parts[4]
	const token = parts[5]

	const [password, setPassword] = useState('')
	const [password_conf, setPasswordConf] = useState('')
	const [message, setMessage] = useState('')

	const router = useRouter()
	const handleSubmit = async (event: any) => {
		event.preventDefault()
		console.log(id)
		console.log(token)
		if (!id || !token) {
			setMessage('Invalid URL parameters')
			return
		}

		if (password !== password_conf) {
			setMessage("Passwords don't match")
			return
		}

		try {
			const response = await axios.post(
				`${BASE_URL}/ResetPassword/${id}/${token}`,
				{ password, password_conf: password_conf }
			)
			setMessage('Password has been reset successfully!')
			window.location.href = '/SignIn'
		} catch (error) {
			console.error('Reset password error:', error)
			setMessage('Failed to reset password.')
		}
	}
	return (
		<div className='relative flex flex-col justify-center min-h-screen overflow-hidden'>
			<div className='w-full p-6 m-auto bg-white rounded-md shadow-xl shadow-blue-300 ring-2 ring-blue-700 lg:max-w-xl'>
				<h1 className='text-xl font-semibold text-center text-blue-700 underline uppercase'>
					Reset Your Password
				</h1>
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label
							htmlFor='password'
							className='block text-sm font-semibold text-gray-800'
						>
							New password
						</label>
						<input
							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder='New password'
							required
						/>
					</div>
					<div className='mb-4'>
						<label
							htmlFor='password_conf'
							className='block text-sm font-semibold text-gray-800'
						>
							Confirm new password
						</label>
						<input
							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
							type='password'
							value={password_conf}
							onChange={(e) => setPasswordConf(e.target.value)}
							placeholder='Confirm new password'
							required
						/>
					</div>
					<p className='mt-8 text-base font-light text-center text-gray-700'>
						<button
							className='font-medium text-indigo-600 text-center hover:underline'
							type='submit'
						>
							Reset Password
						</button>
					</p>
				</form>
				{message && <p>{message}</p>}
			</div>
		</div>
	)
}

export default ResetPassword

// import { useSearchParams } from 'next/navigation'
// import React, { useState, useEffect } from 'react'
// import axios from 'axios'

// const ResetPassword = () => {
// 	const searchParams = new URLSearchParams(window.location.search)
// 	const [password, setPassword] = useState('')
// 	const [passwordConf, setPasswordConf] = useState('')
// 	const [message, setMessage] = useState('')
// 	const [isReady, setIsReady] = useState(false)

// 	useEffect(() => {
// 		// This useEffect will ensure the searchParams are ready and can be used safely
// 		if (searchParams) {
// 			setIsReady(true)
// 		}
// 	}, [searchParams])

// 	const handleSubmit = async (event: React.FormEvent) => {
// 		event.preventDefault()
// 		if (!isReady) return // Exit early if not ready

// 		const id = searchParams.get('_id')
// 		const token = searchParams.get('token')

// 		console.log('id:', id)
// 		console.log('token', token)
// 		if (!id || !token) {
// 			setMessage('Invalid URL parameters')
// 			return
// 		}

// 		if (password !== passwordConf) {
// 			setMessage("Passwords don't match")
// 			return
// 		}

// 		try {
// 			const response = await axios.post(
// 				`http://localhost:5000/api/ResetPassword/${id}/${token}`,
// 				{ password, password_conf: passwordConf }
// 			)
// 			setMessage('Password has been reset successfully!')
// 			// Redirect to signIn page or home
// 			window.location.href = '/signIn' // Adjust path as necessary
// 		} catch (error) {
// 			console.error('Reset password error:', error)
// 			setMessage('Failed to reset password.')
// 		}
// 	}

// 	return (
// 		<div className='relative flex flex-col justify-center min-h-screen overflow-hidden'>
// 			<div className='w-full p-6 m-auto bg-white rounded-md shadow-xl shadow-blue-300 ring-2 ring-blue-700 lg:max-w-xl'>
// 				<h1 className='text-xl font-semibold text-center text-blue-700 underline uppercase'>
// 					Reset Your Password
// 				</h1>
// 				<form onSubmit={handleSubmit}>
// 					<div className='mb-4'>
// 						<label
// 							htmlFor='password'
// 							className='block text-sm font-semibold text-gray-800'
// 						>
// 							New password
// 						</label>
// 						<input
// 							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
// 							type='password'
// 							value={password}
// 							onChange={(e) => setPassword(e.target.value)}
// 							placeholder='New password'
// 							required
// 						/>
// 					</div>
// 					<div className='mb-4'>
// 						<label
// 							htmlFor='passwordConf'
// 							className='block text-sm font-semibold text-gray-800'
// 						>
// 							Confirm new password
// 						</label>
// 						<input
// 							className='block w-full px-4 py-2 mt-2 text-indigo-700 bg-white border rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40'
// 							type='password'
// 							value={passwordConf}
// 							onChange={(e) => setPasswordConf(e.target.value)}
// 							placeholder='Confirm new password'
// 							required
// 						/>
// 					</div>
// 					<p className='mt-8 text-base font-light text-center text-gray-700'>
// 						<button
// 							className='font-medium text-indigo-600 text-center  hover:underline '
// 							type='submit'
// 							disabled={!isReady}
// 						>
// 							Reset Password
// 						</button>
// 					</p>
// 				</form>
// 				{message && <p>{message}</p>}
// 			</div>
// 		</div>
// 	)
// }

// export default ResetPassword
