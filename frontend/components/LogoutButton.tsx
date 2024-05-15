import React from 'react'
import Custombutton from './Custombutton'
import { getCookie } from 'cookies-next'
import { useDispatch } from 'react-redux'
import { logout } from '@/app/lib/UserSlice/UserSlice'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useRouter } from 'next/navigation'
import LogoutIcon from '@mui/icons-material/Logout'
import { Tooltip } from '@mui/material'

const LogoutButton = () => {
	const router = useRouter()
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()

	const handleLogout = () => {
		dispatch(logout())

		router.replace('/')
	}
	return (
		<button
			onClick={handleLogout}
			className='ml-8 text-white bg-gray-600 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
		>
			<Tooltip title='Logout'>
				<LogoutIcon />
			</Tooltip>
		</button>
	)
}

export default LogoutButton
