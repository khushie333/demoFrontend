'use client'
import { CarCard, Custombutton, Dashboard, SearchBar } from '@/components'
import { CarProps, HomeProps } from '@/types'
import { useState, useEffect } from 'react'
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
	const filteredCars = displayedCars.filter((car) => !car.deleted)

	return (
		<main className='overflow-hidden'>
			<Dashboard />

			<div className='mt-10 padding-x padding-y max-width ml' id='discover'>
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
										containerStyles='bg-primary-blue rounded-full text-white'
										handleClick={showMoreCars}
									/>
								</div>
							)}
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
