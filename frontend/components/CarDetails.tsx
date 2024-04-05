'use client'
import { CarProps } from '@/types'
import { Fragment } from 'react'
import Image from 'next/image'

import { Dialog, Transition } from '@headlessui/react'
import React from 'react'
interface CarDetailsProps {
	isOpen: boolean
	closeModel: () => void
	car: CarProps
}

const CarDetails = ({ isOpen, closeModel, car }: CarDetailsProps) => {
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
	// function formatDate(dateString: any) {
	// 	const date = new Date(dateString)
	// 	const day = date.getDate().toString().padStart(2, '0')
	// 	const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are zero-based
	// 	const year = date.getFullYear().toString().slice(-2) // Get last two digits of year

	// 	return `${day}/${month}/${year}`
	// }
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
								<Dialog.Panel className='relative w-full max-w-lg max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all flex flex-col gap-5'>
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
												src={`http://localhost:5000/${images[0]}`}
												alt='car model'
												fill
												priority
												className='object-contain'
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
														className='object-contain'
													/>
												</div>
											))}
										</div>
									</div>

									<div className='flex-1 flex flex-col gap-2'>
										<h2 className='font-semibold text-xl capitalize'>
											{car.brand} {car.Model}
										</h2>

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
																<h4 className='text-grey capitalize'>
																	{key.split('_').join(' ')}
																</h4>
																<p className='text-black-100 font-semibold'>
																	{new Date(value).toLocaleDateString('en-GB')}
																</p>
															</div>
														)
													}
													return (
														<div
															className='flex justify-between gap-5 w-full text-right'
															key={key}
														>
															<h4 className='text-grey capitalize'>
																{key.split('_').join(' ')}
															</h4>
															<p className='text-black-100 font-semibold'>
																{value}
															</p>
														</div>
													)
												})}
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}

export default CarDetails
