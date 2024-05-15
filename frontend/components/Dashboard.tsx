'use client'
import React from 'react'

import Custombutton from './Custombutton'
import Link from 'next/link'
import { motion } from 'framer-motion'

const Dashboard = () => {
	const handleExploreCarsClick = () => {
		const nextSection = document.getElementById('discover')

		if (nextSection) {
			nextSection.scrollIntoView({ behavior: 'smooth' })
		}
	}
	const MotionDiv = motion.div
	return (
		<div className='hero'>
			<div className='flex-1 pt-36 padding-x'>
				<motion.div
					initial='hidden'
					animate='visible'
					variants={{
						hidden: {
							scale: 0.8,
							opacity: 0,
						},
						visible: {
							scale: 1,
							opacity: 1,
							transition: {
								delay: 0.4,
							},
						},
					}}
				>
					<h6 className='hero__title'>
						Find ,Bid and Buy a car quickly and easily!
					</h6>
				</motion.div>
				<p className='hero__subtitle'>
					Streamline your car buying experience with our effortless auction
					process.
				</p>

				<Custombutton
					title='Explore cars'
					containerStyles='bg-primary-blue text-white text-lg font-medium rounded-full mt-10 hover:bg-indigo-600'
					handleClick={handleExploreCarsClick}
				/>
			</div>
			<div className='hero__image-container'>
				<MotionDiv
					className='hero__image top-64'
					initial={{ x: '100vw' }} // Initial position outside the viewport on the right side
					animate={{ x: 0 }} // Final position, moves to the left
					transition={{ type: 'spring', stiffness: 50, duration: 3 }} // Optional: Animation transition
				>
					<img src='/img6.png' alt='cars' className='object-contain' />
				</MotionDiv>

				<div className='hero__image-overlay' />
			</div>
		</div>
	)
}

export default Dashboard
