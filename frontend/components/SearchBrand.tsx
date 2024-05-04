'use client'
import React, { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { Combobox, Transition } from '@headlessui/react'
import { SearchBrandProps, Car } from '@/types'

const SearchBrand = ({ brand, setBrand }: SearchBrandProps) => {
	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
	const [query, setQuery] = useState('')
	const [searchResults, setSearchResults] = useState<Car[]>([])

	const handleSelect = (selectedBrand: string) => {
		setBrand(selectedBrand)
		setQuery(selectedBrand)
	}

	useEffect(() => {
		if (query !== '') {
			axios
				.get(`${BASE_URL}/cars?search=${encodeURIComponent(query)}`)
				.then((response) => {
					setSearchResults(
						response.data.cars.map((car: Car) => ({
							...car,
							displayValue: `${car.brand} ${car.Model} ${car.desc}`,
						}))
					)
				})
				.catch((error) => {
					console.error('Error fetching search results:', error)
					setSearchResults([])
				})
		} else {
			setSearchResults([])
		}
	}, [query])

	return (
		<div className='search-manufacturer'>
			<Combobox value={brand} onChange={setBrand}>
				<div className='relative w-full'>
					<Combobox.Button className='absolute top-[14px]'>
						<Image
							src='/car-logo.svg'
							width={25}
							height={25}
							className='ml-4'
							alt='car logo'
						/>
					</Combobox.Button>
					<Combobox.Input
						className='search-manufacturer__input'
						placeholder='e.g Volkswagen'
						displayValue={(brand: string) => brand}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<Transition
						as={Fragment}
						leave='transition ease-in duration-100'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
						afterLeave={() => setQuery('')}
					>
						<Combobox.Options
							className='absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
							static
						>
							{searchResults.map((item) => (
								<Combobox.Option
									key={item._id}
									className={({ active }) =>
										`relative search-manufacturer__option ${
											active ? 'bg-primary-blue text-white' : 'text-gray-900'
										}`
									}
									value={item.brand}
									onSelect={() => handleSelect(item.brand)} // Trigger search on select
								>
									{({ selected, active }) => (
										<>
											<span
												className={`block truncate ${
													selected ? 'font-medium' : 'font-normal'
												}`}
											>
												<span>{item.brand} </span>
												<span>{item.Model} </span>
												<span>{item.desc} </span>
											</span>

											{/* Show an active blue background color if the option is selected */}
											{selected ? (
												<span
													className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
														active ? 'text-white' : 'text-pribg-primary-purple'
													}`}
												></span>
											) : null}
										</>
									)}
								</Combobox.Option>
							))}
						</Combobox.Options>
					</Transition>
				</div>
			</Combobox>
		</div>
	)
}

export default SearchBrand

// import React, { Fragment, useState, useEffect } from 'react'
// import axios from 'axios'
// import Image from 'next/image'
// import { Combobox, Transition } from '@headlessui/react'
// import { SearchBrandProps, Car } from '@/types'

// const SearchBrand = ({ brand, setBrand }: SearchBrandProps) => {
// 	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
// 	const [query, setQuery] = useState('')
// 	const [searchResults, setSearchResults] = useState<Car[]>([])

// 	useEffect(() => {
// 		if (query !== '') {
// 			axios
// 				.get(`${BASE_URL}/cars?search=${encodeURIComponent(query)}`)
// 				.then((response) => {
// 					setSearchResults(
// 						response.data.cars.map((car: Car) => ({
// 							...car,
// 							displayValue: `${car.brand} ${car.Model} ${car.desc}`,
// 						}))
// 					)
// 				})
// 				.catch((error) => {
// 					console.error('Error fetching search results:', error)
// 					setSearchResults([])
// 				})
// 		} else {
// 			setSearchResults([])
// 		}
// 	}, [query])

// 	return (
// 		<div className='search-manufacturer'>
// 			<Combobox value={brand} onChange={setBrand}>
// 				<div className='relative w-full'>
// 					<Combobox.Button className='absolute top-[14px]'>
// 						<Image
// 							src='/car-logo.svg'
// 							width={25}
// 							height={25}
// 							className='ml-4'
// 							alt='car logo'
// 						/>
// 					</Combobox.Button>
// 					<Combobox.Input
// 						className='search-manufacturer__input'
// 						placeholder='e.g Volkswagen'
// 						displayValue={(brand: string) => brand}
// 						onChange={(e) => setQuery(e.target.value)}
// 					/>
// 					<Transition
// 						as={Fragment}
// 						leave='transition ease-in duration-100'
// 						leaveFrom='opacity-100'
// 						leaveTo='opacity-0'
// 						afterLeave={() => setQuery('')}
// 					>
// 						<Combobox.Options
// 							className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
// 							static
// 						>
// 							{searchResults.map((item) => (
// 								<Combobox.Option
// 									key={item._id}
// 									className={({ active }) =>
// 										`relative search-manufacturer__option ${
// 											active ? 'bg-primary-blue text-white' : 'text-gray-900'
// 										}`
// 									}
// 									value={item.brand}
// 								>
// 									{({ selected, active }) => (
// 										<>
// 											<span
// 												className={`block truncate ${
// 													selected ? 'font-medium' : 'font-normal'
// 												}`}
// 											>
// 												<span>{item.brand} </span>
// 												<span>{item.Model} </span>
// 												<span>{item.desc} </span>
// 											</span>

// 											{/* Show an active blue background color if the option is selected */}
// 											{selected ? (
// 												<span
// 													className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
// 														active ? 'text-white' : 'text-pribg-primary-purple'
// 													}`}
// 												></span>
// 											) : null}
// 										</>
// 									)}
// 								</Combobox.Option>
// 							))}
// 						</Combobox.Options>
// 					</Transition>
// 				</div>
// 			</Combobox>
// 		</div>
// 	)
// }

// export default SearchBrand
