'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import Custombutton from './Custombutton'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'
import { getCookie } from 'cookies-next'
import { useSelector, useDispatch } from 'react-redux'
import { selectIsLoggedIn, login } from '@/app/lib/UserSlice/UserSlice'
import { ThunkDispatch } from '@reduxjs/toolkit'

const Navbar = () => {
	const isLoggedIn = useSelector(selectIsLoggedIn)
	const token = getCookie('token')
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	useEffect(() => {
		// Check token existence and dispatch login or logout actions accordingly
		if (token) {
			dispatch(login({ token }))
		}
	}, [token, dispatch])
	return (
		<header className='w-full absolute z-10'>
			<nav className='max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4'>
				<Link href='/' className='flex justify-center items-center'>
					<Image
						src='/car1.svg'
						alt='car logo'
						width={150}
						height={25}
						className='object-contain'
					></Image>
				</Link>
				{isLoggedIn ? <LogoutButton /> : <LoginButton />}

				{isLoggedIn && (
					<Link
						href={'/UserHome'}
						className='flex justify-center items-center'
						passHref
					>
						<Custombutton
							title='👤MyProfile'
							btnType='button'
							containerStyles='text-primary-blue rounded-full bg-white min-w-[130px]'
						/>
					</Link>
				)}
			</nav>
		</header>
	)
}

export default Navbar
