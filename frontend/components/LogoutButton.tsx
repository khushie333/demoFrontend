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
			className='ml-8 text-white hover:text-orange-600 '
		>
			<Tooltip title='Logout'>
				<LogoutIcon />
			</Tooltip>
		</button>
	)
}

export default LogoutButton
