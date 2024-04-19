'use client'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import Custombutton from './Custombutton'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'
import { getCookie } from 'cookies-next'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn } from '@/app/lib/UserSlice/UserSlice'
const Navbar = () => {
	const isLoggedIn = useSelector(selectIsLoggedIn)
	console.log('fromm navbar:', isLoggedIn)

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
