import React from 'react'
import Link from 'next/link'
import Custombutton from './Custombutton'
import LoginIcon from '@mui/icons-material/Login'
import { Tooltip } from '@mui/material'

export const LoginButton = () => {
	return (
		<Link
			href={'/SignIn'}
			className='text-white bg-gray-600 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
			passHref
		>
			<Tooltip title='LogIn'>
				<LoginIcon />
			</Tooltip>
		</Link>
	)
}

export default LoginButton
