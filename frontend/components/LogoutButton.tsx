import React from 'react'
import Link from 'next/link'
import Custombutton from './Custombutton'
import { getCookie } from 'cookies-next'
import { useDispatch } from 'react-redux'

import UserSlice from '@/app/lib/UserSlice/UserSlice'
import { logout } from '@/app/lib/UserSlice/UserSlice'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useRouter } from 'next/navigation'

const LogoutButton = () => {
	const token = getCookie('token')
	const message = getCookie('message')
	const router = useRouter()
	const status = getCookie('status')
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	// const [loggedIn, setLoggedIn] = useState(false)
	// if (token) {
	// 	setLoggedIn(true)
	// }
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
