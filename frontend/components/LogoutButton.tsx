import React from 'react'
import Custombutton from './Custombutton'
import { getCookie } from 'cookies-next'
import { useDispatch } from 'react-redux'
import { logout } from '@/app/lib/UserSlice/UserSlice'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useRouter } from 'next/navigation'

const LogoutButton = () => {
	const router = useRouter()
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()

	const handleLogout = () => {
		dispatch(logout())

		router.replace('/')
	}
	return (
		<Custombutton
			title='Logout'
			btnType='button'
			handleClick={handleLogout}
			containerStyles='text-primary-blue rounded-full bg-gray-200 min-w-[130px]'
		/>
	)
}

export default LogoutButton
