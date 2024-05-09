'use client'
import React from 'react'

import Custombutton from './Custombutton'
import Link from 'next/link'
const Dashboard = () => {
	const handleExploreCarsClick = () => {
		const nextSection = document.getElementById('discover')

		if (nextSection) {
			nextSection.scrollIntoView({ behavior: 'smooth' })
		}
	}
	return (
		<div className='hero'>
			<div className='flex-1 pt-36 padding-x'>
				<h1 className='hero__title'>
					Find ,Bid and Buy a car -- quickly and easily!
				</h1>
				<p className='hero__subtitle'>
					Streamline your car buying experience with our effortless auction
					process.
				</p>
				<Link href='#'>
					<Custombutton
						title='Explore cars'
						containerStyles='bg-primary-blue text-white text-lg font-medium rounded-full mt-10'
						handleClick={handleExploreCarsClick}
					/>
				</Link>
			</div>
			<div className='hero__image-container'>
				<div className='hero__image top-64'>
					<img src='/img6.png' alt='cars' className='object-contain' />
				</div>
				<div className='hero__image-overlay' />
			</div>
		</div>
	)
}

export default Dashboard
