'use client'
import {
	CarCard,
	Custombutton,
	Dashboard,
	Filter,
	SearchBar,
} from '@/components'
import { CarProps, HomeProps } from '@/types'
import { useState, useEffect } from 'react'
import { fetchcars } from '@/utils'
import { quantum } from 'ldrs'

export default function Home({ searchParams }: HomeProps) {
	const [displayedCars, setDisplayedCars] = useState<CarProps[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isClient, setIsClient] = useState(false)
	const [minPriceFromFilter, setMinPriceFromFilter] = useState('')
	const [maxPriceFromFilter, setMaxPriceFromFilter] = useState('')
	useEffect(() => {
		setIsClient(typeof window !== 'undefined')
	}, [])
	quantum.register()
	const [isDataEmpty, setIsDataEmpty] = useState(true)
	const [allCars, setAllCars] = useState<any[]>([])
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			const allCars = await fetchcars(
				{
					brand: searchParams.brand || '',
					Model: searchParams.Model || '',
					minPrice: searchParams.minPrice,
					maxPrice: searchParams.maxPrice,
				},
				{
					limit: '30',
				}
			)
			setTimeout(() => {
				setAllCars(allCars)
				setDisplayedCars(allCars.slice(0, 20))
				setIsDataEmpty(!Array.isArray(allCars) || allCars.length < 1)
				setIsLoading(false)
			}, 1000)
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
	useEffect(() => {
		filterCarsByPrice()
	}, [minPriceFromFilter, maxPriceFromFilter, allCars])
	const filterCarsByPrice = () => {
		let filteredCars = allCars
		if (minPriceFromFilter) {
			filteredCars = filteredCars.filter(
				(car) => car.baseAmount >= parseFloat(minPriceFromFilter)
			)
		}
		if (maxPriceFromFilter) {
			filteredCars = filteredCars.filter(
				(car) => car.baseAmount <= parseFloat(maxPriceFromFilter)
			)
		}
		setDisplayedCars(filteredCars.slice(0, 20))
	}
	const handlePriceChange = (minPrice: string, maxPrice: string) => {
		setMinPriceFromFilter(minPrice)
		setMaxPriceFromFilter(maxPrice)
	}

	const showMoreCars = async () => {
		const remainingCars = allCars.slice(displayedCars.length)
		console.log(displayedCars)

		console.log(remainingCars)
		const nextCars = remainingCars.slice(0, 4)
		setDisplayedCars((prevCars) => [...prevCars, ...nextCars])
	}
	const filteredCars = displayedCars.filter((car) => !car.deleted)

	return (
		<main className='overflow-hidden'>
			{isClient && isLoading ? (
				<div
					className='fixed w-full h-full backdrop-blur-3xl bg-opacity-100 flex justify-center items-center'
					style={{
						display: 'flex',
						justifyContent: 'space-evenly',
						alignItems: 'center',
						height: '100vh',
						zIndex: 9999,
					}}
				>
					<l-quantum size={90} speed={2.2}></l-quantum>
				</div>
			) : (
				<>
					<Dashboard />
					<div className='mt-10 padding-x padding-y max-width ml' id='discover'>
						<div className='home__text-container'>
							<h1 className='text-4xl font-extrabold'>Cars Catalogue</h1>
							<p>Explore the Cars you might like</p>
						</div>
						<div className='home__filter flex flex-row'>
							<SearchBar />
							<Filter onPriceChange={handlePriceChange} />

							<div className='home__filter-container'>
								{/* {allCars?.map((car: any) => ( */}
								{/* <CustomFilter title='baseAmount' options={baseAmountOptions} /> */}
								{/* ))} */}
							</div>
						</div>
						{!isDataEmpty ? (
							<section>
								<div className='home__cars-wrapper'>
									{filteredCars?.map((car: any, index: number) => (
										<CarCard key={index} car={car} />
									))}
								</div>
								<div className='w-full flex-center gap-5 mt-10'>
									{displayedCars.length !== allCars.length && (
										<div className='w-full flex-center gap-5 mt-10'>
											<Custombutton
												btnType='button'
												title='Show More'
												containerStyles='bg-primary-blue rounded-full text-white hover:bg-indigo-600'
												handleClick={showMoreCars}
											/>
										</div>
									)}
								</div>
							</section>
						) : (
							<div className=''>
								<h2 className='text-black text-xl font-bold'>
									oops,no results
								</h2>
							</div>
						)}
					</div>
				</>
			)}
		</main>
	)
}
