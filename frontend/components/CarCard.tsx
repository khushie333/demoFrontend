'use client'
import { CarProps } from '@/types'
import Image from 'next/image'
import Custombutton from './Custombutton'
import React, { useState, useEffect } from 'react'
import CarDetails from './CarDetails'
import axios from 'axios'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { getCookie } from 'cookies-next'
interface CarCardProps {
	car: CarProps
}

const CarCard = ({ car }: CarCardProps) => {
	const [cars, setCars] = useState<CarProps[]>([])
	const [bookmarkedcar, setbookmarkedcar] = useState([])
	const [isBookmarked, setIsBookmarked] = useState(false)
	const token = getCookie('token')
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	// const handleClick = () => {
	// 	setIsClicked(!isClicked)
	// }
	useEffect(() => {
		checkIsBookmarked()
	}, [])
	const checkIsBookmarked = async () => {
		try {
			// Send a request to check if the car is bookmarked
			const response = await axios.get(
				`http://localhost:5000/api/bookmarks/user`,
				config
			)
			const bookmarkedCars = response.data.bookmarks

			// Check if the current car exists in the list of bookmarked cars
			const isCarBookmarked = bookmarkedCars.some(
				(bookmarkedCars: any) => bookmarkedCars.car === car._id
			)

			// Update the state accordingly
			setIsBookmarked(isCarBookmarked)
		} catch (error) {
			console.error('Error checking bookmark:', error)
		}
	}
	const handleBookmark = async () => {
		try {
			// Send a request to toggle the bookmark status
			if (isBookmarked) {
				await axios.delete(
					`http://localhost:5000/api/bookmarks/${car._id}`,
					config
				)
				setIsBookmarked(false)
			} else {
				await axios.post(
					`http://localhost:5000/api/bookmarks/${car._id}`,
					{},
					config
				)
				setIsBookmarked(true)
			}
		} catch (error) {
			console.error('Error toggling bookmark:', error)
		}
	}
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
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const year = date.getFullYear().toString().slice(-2)

		return `${day}/${month}/${year}`
	}

	return (
		<div className='car-card group'>
			<div className='car-card__content'>
				<h2 className='car-card__content-title'>
					{brand} {Model}
				</h2>
				<button onClick={handleBookmark}>
					{!isBookmarked ? (
						<BookmarkBorderIcon
							sx={{
								'&:hover': {
									color: 'royalblue',
								},
							}}
						/>
					) : (
						<BookmarkIcon />
					)}
				</button>
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
			<p className='flex mt-6 text-[32px] font-semibold border-gray-400'>
				<span className='self-start text-[18px] font-semibold'>
					Bid end date:{formatDate(bidEndDate)}
				</span>
			</p>
			<div className='relative flex w-full  mt-2'>
				<div className='flex group-hover:invisible w-full m-5 justify-between items-center text-gray-600'>
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
					<div className='flex group-hover:invisible w-full justify-between items-center text-gray-600 '>
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
