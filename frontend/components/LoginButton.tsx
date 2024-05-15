import React from 'react'
import Link from 'next/link'
import Custombutton from './Custombutton'
import LoginIcon from '@mui/icons-material/Login'
import { Tooltip } from '@mui/material'

export const LoginButton = () => {
	return (
		<Link
			href={'/SignIn'}
			className='flex justify-center text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
			passHref
		>
			<Tooltip title='LogIn'>
				<LoginIcon />
			</Tooltip>
		</Link>
	)
}

export default LoginButton
