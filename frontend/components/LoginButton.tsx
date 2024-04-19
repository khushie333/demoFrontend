import React from 'react'
import Link from 'next/link'
import Custombutton from './Custombutton'

export const LoginButton = () => {
	return (
		<Link
			href={'/SignIn'}
			className='flex justify-center items-center mx-20'
			passHref
		>
			<Custombutton
				title='Sign In'
				btnType='button'
				containerStyles='text-primary-blue rounded-full bg-gray-200 min-w-[130px] transition ease-in-out duration-500'
			/>
		</Link>
	)
}

export default LoginButton
