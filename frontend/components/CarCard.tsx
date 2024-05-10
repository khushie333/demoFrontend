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
import { fetchMaxBid } from '@/utils'
import { format } from 'date-fns'

import { motion, AnimatePresence } from 'framer-motion'
interface CarCardProps {
	car: CarProps
}

const CarCard = ({ car }: CarCardProps) => {
	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
	const [maxBid, setMaxBid] = useState(null)
	const [cars, setCars] = useState<CarProps[]>([])
	const [bookmarkedcar, setbookmarkedcar] = useState([])
	const [isBookmarked, setIsBookmarked] = useState(false)

	const token = getCookie('token')
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch max bid
				const maxBidData = await fetchMaxBid({ car })
				if (maxBidData && maxBidData.data.maxBidAmount !== maxBid) {
					setMaxBid(maxBidData.data.maxBidAmount)
				}

				// Fetch bookmarks
				if (token) {
					checkIsBookmarked()
					// Update state with bookmark data
				} else {
					console.log('No token, skipping bookmark fetching')
				}
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}

		const interval = setInterval(fetchData, 5000)
		// Cleanup function to clear the interval when the component unmounts
		return () => clearInterval(interval)
	}, [maxBid])

	const checkIsBookmarked = async () => {
		try {
			// Send a request to check if the car is bookmarked

			const response = await axios.get(`${BASE_URL}/bookmarks/user`, config)
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
				await axios.delete(`${BASE_URL}/bookmarks/${car._id}`, config)
				setIsBookmarked(false)
			} else {
				await axios.post(`${BASE_URL}/bookmarks/${car._id}`, {}, config)
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
			<p className='flex gap-1 mt-6 text-[25px] font-semibold'>
				<div className='self-start text-[18px] font-semibold text-blue-600'>
					Initial bid
				</div>
				<div className=' font-semibold text-black'>{baseAmount}</div>

				<span className='self-end text-[20px] font-medium'> ₹</span>
			</p>
			<div className='relative my-3 object-cont'>
				<motion.div
					className='card'
					whileHover={{
						position: 'relative',
						zIndex: 1,
						background: 'white',
						scale: 1.2,
						transition: {
							duration: 0.2,
						},
					}}
				>
					<Image
						src={`http://localhost:5000/${images[0]}`}
						height={280}
						width={280}
						priority
						className='object-contain'
						alt='car image'
					/>
				</motion.div>
			</div>
			<p className='flex mt-6 text-[32px] font-semibold border-gray-400'>
				{maxBid ? (
					<span className='flex flex-row self-start text-[18px] font-semibold'>
						<p className='text-blue-500'> Max Bid: </p>
						{maxBid} ₹
					</span>
				) : (
					<span className='self-start text-[18px] font-semibold'>
						{' '}
						No bids yet
					</span>
				)}
			</p>
			<p className='flex mt-6 text-[32px] font-semibold border-gray-400'>
				<span className='flex flex-row self-start text-[18px] font-semibold'>
					<div className='self-start text-[18px] font-semibold text-blue-600'>
						{' '}
						Bid end date:
					</div>
					{format(new Date(bidEndDate), 'PPP')} ⏳
				</span>
			</p>
			<div className='relative flex w-full  mt-2 items-center align-middle '>
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

				<div className='relative flex w-full  mt-2 items-center'>
					<div className='flex group-hover:invisible w-full m-5 justify-between items-center text-gray-600 '>
						<div className='flex flex-col justify-center items-center gap-2'>
							<Image src='/tire.svg' width={20} height={20} alt='tire' />
							<p className='text-[14px] leading-[17px]'>{owner}</p>
						</div>
					</div>
				</div>
				<div className='car-card__btn-container'>
					<Custombutton
						title='View More'
						containerStyles='w-full py-[16px] rounded-full hover:bg-orange-500'
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
