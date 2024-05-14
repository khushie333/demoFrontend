import React from 'react'
import Link from 'next/link'
import Custombutton from './Custombutton'
import LoginIcon from '@mui/icons-material/Login'
import { Tooltip } from '@mui/material'

export const LoginButton = () => {
	return (
		<Link
			href={'/SignIn'}
			className='flex justify-center items-center mx-20 text-white hover:text-orange-600 '
			passHref
		>
			<Tooltip title='LogIn'>
				<LoginIcon />
			</Tooltip>
		</Link>
	)
}

export default LoginButton
