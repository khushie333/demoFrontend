'use client'
import { CarProps } from '@/types'
import { Fragment, useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Dialog, Transition, Disclosure } from '@headlessui/react'

import React from 'react'
import Custombutton from './Custombutton'

import Link from 'next/link'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import { ToastError, ToastSuccess } from './ToastContainer'
import { fetchMaxBid } from '@/utils'

interface CarDetailsProps {
	isOpen: boolean
	closeModel: () => void
	car: CarProps
}

const CarDetails = ({ isOpen, closeModel, car }: CarDetailsProps) => {
	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

	let [isOpenDialog, setIsOpenDialog] = useState(true)
	const [mainImageIndex, setMainImageIndex] = useState(0)

	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
	const [maxBid, setMaxBid] = useState<number | null>(null)
	const [maxBidchange, setMaxBidAmountchange] = useState<number | null>(
		maxBid ?? 0
	)

	const [token, settoken] = useState<any>()
	const [bidAmount, setBidAmount] = useState(car.baseAmount)
	useEffect(() => {
		const jwt = getCookie('token')
		settoken(jwt)
	}, [token])
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	useEffect(() => {
		const interval = setInterval(() => {
			fetchMaxBid({ car }).then((data) => {
				if (data && data.data.maxBidAmount !== maxBid) {
					setMaxBid(data.data.maxBidAmount)
				}
			})
		}, 5000)

		setMaxBidAmountchange(maxBid)
		return () => clearInterval(interval)
	}, [car, maxBid])
	function openModal() {
		setIsOpenDialog(true)
	}
	const handleImageClick = (index: any) => {
		setMainImageIndex(index)
	}
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

	const displayKeys = [
		'brand',
		'Model',
		'desc',
		'owner',
		'baseAmount',
		'bidStartDate',
		'bidEndDate',
	]

	const handleBidAmountChange = (event: any) => {
		setMaxBidAmountchange(event.target.value)
	}
	const handleSubmit = async (event: any) => {
		event.preventDefault()
		const newBid = Number(maxBidchange ?? 0)
		const currentMaxBid = Number(maxBid ?? 0)
		const minimumBid = Math.max(currentMaxBid, car.baseAmount)

		if (newBid > minimumBid) {
			setIsConfirmationOpen(true) // Open confirmation dialog
		} else {
			ToastError(
				`Your bid must be greater than the current highest bid of ${minimumBid}.`
			)
		}
	}
	const handleConfirmBid = async () => {
		try {
			const response = await axios.post(
				`${BASE_URL}/bids/${car._id}`,
				{ amount: maxBidchange },
				config
			)
			if (response.status) {
				ToastSuccess('Your Bid has been added successfully')
				setIsConfirmationOpen(false)
			}
		} catch (error) {
			ToastError('Please sign in first')
			setIsConfirmationOpen(false) // Close confirmation dialog
		}
		setBidAmount(maxBidchange ?? 0)
	}
	const openConfirmation = () => {
		setIsConfirmationOpen(true)
	}

	// Function to close the confirmation dialog
	const closeConfirmation = () => {
		setIsConfirmationOpen(false)
	}

	return (
		<>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as='div' className='relative z-10' onClose={closeModel}>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-black bg-opacity-25' />
					</Transition.Child>

					<div className='fixed inset-0 overflow-y-auto'>
						<div className='flex min-h-full items-center justify-center p-4 text-center'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-out duration-300'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<Dialog.Panel className='relative w-full max-w-lg max-h-fit overflow-y-auto transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all flex flex-col gap-5'>
									<button
										type='button'
										className='absolute top-2 right-2 z-10 w-fit p-2 bg-primary-blue-100 rounded-full'
										onClick={closeModel}
									>
										<Image
											src='/close.svg'
											alt='close'
											width={20}
											height={20}
											className='object-contain'
										/>
									</button>

									<div className='flex-1 flex flex-col gap-3'>
										<div className='relative w-full h-40 bg-pattern bg-cover bg-center rounded-lg'>
											<Image
												src={`http://localhost:5000/${images[mainImageIndex]}`}
												alt='car model'
												fill
												priority
												className='object-contain cursor-pointer'
												onClick={() => handleImageClick(0)}
											/>
										</div>

										<div className='flex gap-3'>
											{images.slice(0, 3).map((image, index) => (
												<div
													className='flex-1 relative w-full h-24 bg-primary-blue-100 rounded-lg'
													key={index}
												>
													<Image
														src={`http://localhost:5000/${image}`}
														alt='car model'
														fill
														priority
														className='object-contain cursor-pointer'
														onClick={() => handleImageClick(index)}
													/>
												</div>
											))}
										</div>
									</div>

									<div className='flex-1 flex flex-col gap-2'>
										<h2 className='font-semibold text-xl capitalize'>
											{car.brand} {car.Model}
										</h2>
										{maxBid !== null && (
											<h2 className='font-semibold text-xl capitalize'>
												Maximum bid uptill Now: {maxBid} rs
											</h2>
										)}

										<div className='mt-3 flex flex-wrap gap-4'>
											{Object.entries(car)
												.filter(([key]) => displayKeys.includes(key))
												.map(([key, value]) => {
													if (key === 'bidStartDate' || key === 'bidEndDate') {
														return (
															<div
																className='flex justify-between gap-5 w-full text-right'
																key={key}
															>
																<h4 className='text-gray-700 font-semibold capitalize'>
																	{key.split('_').join(' ')}
																</h4>
																<p className='text-black-100 font-semibold'>
																	{new Date(value).toLocaleDateString('en-GB')}
																</p>
															</div>
														)
													}
													return (
														<>
															<div
																className='flex justify-between gap-5 w-full text-right'
																key={key}
															>
																<h4 className='text-gray-700 font-semibold capitalize'>
																	{key.split('_').join(' ')}
																</h4>
																<p className='text-black-100 font-semibold'>
																	{value}
																</p>
															</div>
														</>
													)
												})}
										</div>
										<Disclosure>
											{({ open }) => (
												<>
													<Disclosure.Button className='flex w-full items-center justify-between rounded-lg bg-blue-600 px-4 py-2 font-bold text-lg text-white hover:bg-indigo-600 focus:outline-none focus-visible:ring focus-visible:ring-blue-500/75'>
														<span>Add bid </span>
														<ChevronDownIcon
															className={`${
																open ? 'rotate-180 transform' : ''
															} h-10 w-10 text-white`}
														/>
													</Disclosure.Button>
													<Disclosure.Panel className='px-4 pb-2 pt-4 text-black-100 font-bold text-lg'>
														<form className='mt-1' onSubmit={handleSubmit}>
															<input
																type='number'
																value={
																	maxBidchange !== null
																		? maxBidchange
																		: baseAmount
																}
																onChange={handleBidAmountChange}
																name='bidAmount'
																placeholder='Enter your bid amount'
																className='w-full p-2 border border-gray-300 rounded'
																required
															/>
															<button
																type='submit'
																onClick={openModal}
																className='mt-2 w-full bg-blue-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded'
															>
																Submit Bid ✅
															</button>
														</form>
													</Disclosure.Panel>
												</>
											)}
										</Disclosure>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>

			<Transition show={isConfirmationOpen} as={React.Fragment}>
				<Dialog
					as='div'
					className='fixed z-10 inset-0 overflow-y-auto'
					onClose={closeConfirmation}
				>
					<Transition.Child
						as={React.Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<Dialog.Overlay className='inset-0 bg-black bg-opacity-15' />
					</Transition.Child>

					<Transition.Child
						as={React.Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0 scale-95'
						enterTo='opacity-100 scale-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100 scale-100'
						leaveTo='opacity-0 scale-95'
					>
						<div className='flex items-center justify-center min-h-screen'>
							<div className='bg-white p-8 rounded-lg shadow-md'>
								<Dialog.Title>
									<b>Confirm Bid</b>
								</Dialog.Title>
								<Dialog.Description>
									Are you sure you want to add your bid?
								</Dialog.Description>

								<div className='mt-4 flex justify-between'>
									<button
										className='px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600'
										onClick={handleConfirmBid}
									>
										Yes, I'm sure
									</button>
									<button
										className='px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded hover:bg-gray-300'
										onClick={() => setIsConfirmationOpen(false)}
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					</Transition.Child>
				</Dialog>
			</Transition>
		</>
	)
}

export default CarDetails
