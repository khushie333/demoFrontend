'use client'
import {
	CarCard,
	Custombutton,
	CustomFilter,
	Dashboard,
	SearchBar,
	ShowMore,
	Signup,
} from '@/components'
import { headers } from 'next/headers'
import Image from 'next/image'
import { CarProps, filterProps, HomeProps } from '@/types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { fetchcars } from '@/utils'

export default function Home({ searchParams }: HomeProps) {
	const [displayedCars, setDisplayedCars] = useState<CarProps[]>([])
	const [loading, setloading] = useState(false)

	const [isDataEmpty, setIsDataEmpty] = useState(true)
	const [allCars, setAllCars] = useState<any[]>([])
	useEffect(() => {
		const fetchData = async () => {
			const allCars = await fetchcars(
				{
					brand: searchParams.brand || '',
					Model: searchParams.Model || '',
					baseAmount: searchParams.baseAmount || ',',
				},
				{
					limit: '',
				}
			)
			setAllCars(allCars)
			setDisplayedCars(allCars.slice(0, 8))
			setIsDataEmpty(!Array.isArray(allCars) || allCars.length < 1)
		}

		fetchData()

		const resetUrl = () => {
			window.history.pushState({}, document.title, window.location.origin)
		}
		resetUrl()

		return () => {
			resetUrl()
		}
	}, [searchParams])

	const showMoreCars = async () => {
		const remainingCars = allCars.slice(displayedCars.length)
		const nextCars = remainingCars.slice(0, 8)
		setDisplayedCars((prevCars) => [...prevCars, ...nextCars])
	}

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

					<div className='home__filter-container'>
						{/* {allCars?.map((car: any) => ( */}
						{/* <CustomFilter title='baseAmount' options={baseAmountOptions} /> */}
						{/* ))} */}
					</div>
				</div>
				{!isDataEmpty ? (
					<section>
						<div className='home__cars-wrapper'>
							{displayedCars?.map((car: any, index: number) => (
								<CarCard key={index} car={car} />
							))}
						</div>
						<div className='w-full flex-center gap-5 mt-10'>
							<Custombutton
								btnType='button'
								title='Show More'
								containerStyles='bg-primary-blue rounded-full text-white'
								handleClick={showMoreCars}
							/>
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

// import {
// 	CarCard,
// 	Custombutton,
// 	CustomFilter,
// 	Dashboard,
// 	SearchBar,
// 	ShowMore,
// 	Signup,
// } from '@/components'
// import { headers } from 'next/headers'
// import Image from 'next/image'
// import { CarProps, filterProps, HomeProps } from '@/types'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/router'
// import { fetchcars } from '@/utils'

// export default async function Home({ searchParams }: HomeProps) {
// 	useEffect(() => {
// 		const resetUrl = () => {
// 			window.history.pushState({}, document.title, window.location.origin)
// 		}
// 		resetUrl()
// 		return () => {
// 			resetUrl()
// 		}
// 	}, [])

// 	const allCars = await fetchcars(
// 		{
// 			brand: searchParams.brand || '',
// 			Model: searchParams.Model || '',
// 			baseAmount: searchParams.baseAmount || ',',
// 		},
// 		{
// 			limit: '',
// 		}
// 	)
// 	const [displayedCars, setDisplayedCars] = useState(allCars.slice(0, 6))
// 	//const allCars = await fetchcars()

// 	const baseAmountOptions = allCars.map((car: any) => car.baseAmount)
// 	const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars
// 	const showMoreCars = () => {
// 		const remainingCars = allCars.slice(displayedCars.length)
// 		const nextCars = remainingCars.slice(0, 6)
// 		setDisplayedCars((prevCars: any) => [...prevCars, ...nextCars])
// 	}

// 	return (
// 		<main className='overflow-hidden'>
// 			<Dashboard />

// 			<div className='mt-12 padding-x padding-y max-width' id='discover'>
// 				<div className='home__text-container'>
// 					<h1 className='text-4xl font-extrabold'>Cars Catalogue</h1>
// 					<p>Explore the Cars you might like</p>
// 				</div>
// 				<div className='home__filter'>
// 					<SearchBar />

// 					<div className='home__filter-container'>
// 						{/* {allCars?.map((car: any) => ( */}
// 						{/* <CustomFilter title='baseAmount' options={baseAmountOptions} /> */}
// 						{/* ))} */}
// 					</div>
// 				</div>
// 				{!isDataEmpty ? (
// 					<section>
// 						<div className='home__cars-wrapper'>
// 							{displayedCars?.map((car: any, index: number) => (
// 								<CarCard key={index} car={car} />
// 							))}
// 						</div>
// 						<Custombutton
// 							btnType='button'
// 							title='Show More'
// 							containerStyles='bg-primary-blue rounded-full text-white'
// 							handleClick={showMoreCars}
// 						/>
// 					</section>
// 				) : (
// 					<div className=''>
// 						<h2 className='text-black text-xl font-bold'>oops,no results</h2>
// 					</div>
// 				)}
// 			</div>
// 		</main>
// 	)
// }
