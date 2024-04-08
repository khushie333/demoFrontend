'use client'
import { CarCard, CustomFilter, Dashboard, SearchBar } from '@/components'
import { headers } from 'next/headers'
import Image from 'next/image'
import { CarProps, filterProps } from '@/types'
import { useState } from 'react'
//import axios from 'axios'

export async function fetchcars(filters: filterProps) {
	const { brand, Model } = filters
	const timestamp = new Date().getTime() // Current timestamp

	if (Model && brand) {
		const response = await fetch(
			`http://localhost:5000/api/cars?search=${encodeURIComponent(
				brand
			)}&Model=${encodeURIComponent(Model)}`,
			{
				headers: {
					'Cache-Control': 'no-store',
					Pragma: 'no-store',
				},
			}
		)
		if (response.ok) {
			const result = await response.json()

			console.log('HI there', result)
			return result
		} else {
			console.log('no response')
		}
	} else {
		const response = await fetch(
			`http://localhost:5000/api/car?_=${timestamp}`,
			{
				headers: {
					'Cache-Control': 'no-store',
					Pragma: 'no-store',
				},
			}
		)
		const result = await response.json()
		console.log(result)
		return result
	}
}
interface CarDetailsProps {
	isOpen: boolean
	closeModel: () => void
	car: CarProps
}

export default async function Home(searchParams: any) {
	const [selectedBrand, setSelectedBrand] = useState('')
	const handleBrandSelect = (brand: string) => {
		setSelectedBrand(brand)
	}
	console.log(searchParams.Model, searchParams.brand)

	//const allCars = await fetchcars()
	const allCars = await fetchcars({
		brand: searchParams.brand || '',
		Model: searchParams.Model || '',
	})

	// console.log(allCars)
	const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars

	return (
		<main className='overflow-hidden'>
			<Dashboard />
			<div className='mt-12 padding-x padding-y max-width' id='discover'>
				<div className='home__text-container'>
					<h1 className='text-4xl font-extrabold'>Cars Catalogue</h1>
					<p>Explore the Cars you might like</p>
				</div>
				<div className='home__filter'>
					<SearchBar />

					<div className='home__filter-container'></div>
				</div>
				{!isDataEmpty ? (
					<section>
						<div className='home__cars-wrapper'>
							{(allCars || selectedBrand)?.map((car: any) => (
								<CarCard car={car} Brand={selectedBrand} />
							))}
						</div>
					</section>
				) : (
					<div className=''>
						<h2 className='text-black text-xl font-bold'>oops,no results</h2>
					</div>
				)}
			</div>
		</main>
	)
}
