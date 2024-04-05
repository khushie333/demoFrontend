'use client'
import { CarProps } from '@/types'
import Image from 'next/image'
import Custombutton from './Custombutton'
import React, { useState } from 'react'
import CarDetails from './CarDetails'

interface CarCardProps {
	car: CarProps
}

const CarCard = ({ car }: CarCardProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const {
		user,
		brand,
		Model,
		desc,
		owner,
		images,
		baseAmount,
		bidStartDate,
		bidEndDate,
	} = car
	function formatDate(dateString: any) {
		const date = new Date(dateString)
		const day = date.getDate().toString().padStart(2, '0')
		const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are zero-based
		const year = date.getFullYear().toString().slice(-2) // Get last two digits of year

		return `${day}/${month}/${year}`
	}

	return (
		<div className='car-card group'>
			<div className='car-card__content'>
				<h2 className='car-card__content-title'>
					{brand} {Model}
				</h2>
			</div>
			<p className='flex mt-6 text-[32px] font-semibold'>
				<span className='self-start text-[14px] font-semibold'>
					Initial bid
				</span>
				{baseAmount}
				<span className='self-end text-[14px] font-medium'> rs</span>
			</p>
			<div className='relative w-full h-50 my-3 object-cont'>
				<Image
					src={`http://localhost:5000/${images[0]}`}
					height={200}
					width={200}
					priority
					className='object-contain'
					alt='car image'
				/>
			</div>
			<p className='flex mt-6 text-[32px] font-semibold'>
				<span className='self-start text-[18px] font-semibold'>
					Bid end date:{formatDate(bidEndDate)}
				</span>
			</p>
			<div className='relative flex w-full  mt-2'>
				<div className='flex group-hover:invisible w-full justify-between text-gray-600'>
					<div className='flex flex-col justify-center items-center gap-2'>
						<Image
							src='/steering-wheel.svg'
							width={20}
							height={20}
							alt='steering wheel'
						/>
						<p className='text-[14px] leading-[17px]'>{desc}</p>
					</div>
				</div>

				<div className='relative flex w-full  mt-2'>
					<div className='flex group-hover:invisible w-full justify-between text-gray-600'>
						<div className='flex flex-col justify-center items-center gap-2'>
							<Image src='/tire.svg' width={20} height={20} alt='tire' />
							<p className='text-[14px] leading-[17px]'>{owner}</p>
						</div>
					</div>
				</div>
				<div className='car-card__btn-container'>
					<Custombutton
						title='View More'
						containerStyles='w-full py-[16px] rounded-full bg-primary-blue'
						textStyles='text-white text-[16px] leading-[17px] font-bold'
						rightIcon='/right-arrow.svg'
						handleClick={() => setIsOpen(true)}
					/>
				</div>
			</div>
			<CarDetails
				isOpen={isOpen}
				closeModel={() => setIsOpen(false)}
				car={car}
			/>
		</div>
	)
}

export default CarCard
