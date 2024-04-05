import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Custombutton from './Custombutton'

const Navbar = () => {
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
				<Custombutton
					title='sign-in'
					btnType='button'
					containerStyles='text-primary-blue rounded-full bg-white min-w-[130px]'
				/>
			</nav>
		</header>
	)
}

export default Navbar
