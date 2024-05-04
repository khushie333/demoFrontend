'use client'
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Car } from '@/types'

const Filter = ({ onPriceChange }: any) => {
	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

	const [minPrice, setMinPrice] = useState('')
	const [maxPrice, setMaxPrice] = useState('')
	const [minPriceCars, setMinPriceCars] = useState<Car[]>([])
	const [maxPriceCars, setMaxPriceCars] = useState<Car[]>([])
	const [error, setError] = useState('')
	const [activeInput, setActiveInput] = useState<'min' | 'max'>('min')
	const [showMinDropdown, setshowMinDropdown] = useState<Boolean>(false)
	const [showMaxDropdown, setshowMaxDropdown] = useState<Boolean>(false)

	const minInputRef = useRef<HTMLInputElement>(null)
	const maxInputRef = useRef<HTMLInputElement>(null)

	const fetchCars = (price: string, type: 'min' | 'max') => {
		let apiUrl = `${BASE_URL}/carFilter`
		const params = new URLSearchParams()

		if (price) params.append(type === 'min' ? 'minPrice' : 'maxPrice', price)

		apiUrl += `?${params.toString()}`
		axios
			.get<{ cars: Car[] }>(apiUrl)
			.then((response) => {
				if (type === 'min') {
					setMinPriceCars(response.data.cars)
				} else {
					setMaxPriceCars(response.data.cars)
				}
				setError('')
			})
			.catch((error) => {
				console.error('Error fetching cars:', error)
				setError('Failed to fetch cars. Please try again.')
				if (type === 'min') {
					setMinPriceCars([])
				} else {
					setMaxPriceCars([])
				}
			})
	}

	useEffect(() => {
		if (minPrice !== '') {
			fetchCars(minPrice, 'min')
		}
	}, [minPrice])

	useEffect(() => {
		if (maxPrice !== '') {
			fetchCars(maxPrice, 'max')
		}
	}, [maxPrice])

	const handleInputFocus = (inputType: 'min' | 'max') => {
		setActiveInput(inputType)
		if (inputType === 'min') {
			setshowMinDropdown(true)
			setshowMaxDropdown(false)
		}
		if (inputType === 'max') {
			setshowMaxDropdown(true)
			setshowMinDropdown(false)
		}
	}
	const handleMinOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setMinPrice(value)
		setshowMinDropdown(true)

		if (value === '') {
			setshowMinDropdown(false)
		} else {
			setshowMinDropdown(true)
		}
		onPriceChange(value, maxPrice)
	}

	const handleMaxOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setMaxPrice(value)
		setshowMaxDropdown(true)

		if (value === '') {
			setshowMaxDropdown(false)
		} else {
			setshowMaxDropdown(true)
		}
		onPriceChange(minPrice, value)
	}

	const handleSelectCar = (car: Car) => {
		if (activeInput === 'min') {
			setMinPrice(car.baseAmount.toString())
			setshowMinDropdown(false)
		} else {
			setMaxPrice(car.baseAmount.toString())
			setshowMaxDropdown(false)
		}
	}

	return (
		<>
			<div className='filter-cars-dropdown relative'>
				<input
					ref={minInputRef}
					type='number'
					placeholder='Min Price'
					value={minPrice}
					onChange={(e) => {
						handleMinOnchange(e)
					}}
					onFocus={() => {
						handleInputFocus('min')
					}}
					onSelect={handleMinOnchange}
					className='px-2 py-1 border rounded'
				/>
				{showMinDropdown && (
					<div
						onMouseLeave={() => setshowMinDropdown(false)}
						className='dropdown-content bg-white rounded-md shadow-lg absolute z-50'
					>
						<ul>
							{minPriceCars.map((car, index) => (
								<li
									key={index}
									onClick={() => handleSelectCar(car)}
									className='px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-600 dark:hover:text-white'
								>
									₹{car.baseAmount}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
			<div className='filter-cars-dropdown relative'>
				<input
					ref={maxInputRef}
					type='number'
					placeholder='Max Price'
					value={maxPrice}
					onChange={(e) => {
						handleMaxOnchange(e)
					}}
					onSelect={handleMaxOnchange}
					onFocus={() => handleInputFocus('max')}
					className='px-2 py-1 border rounded'
				/>
				{showMaxDropdown && (
					<div
						onMouseLeave={() => setshowMaxDropdown(false)}
						className='dropdown-content bg-white rounded-md shadow-lg absolute z-50'
					>
						<ul>
							{maxPriceCars.map((car, index) => (
								<li
									key={index}
									onClick={() => handleSelectCar(car)}
									className='px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-600 dark:hover:text-white'
								>
									₹{car.baseAmount}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
			{error && <p className='text-red-500'>{error}</p>}
		</>
	)
}

export default Filter
