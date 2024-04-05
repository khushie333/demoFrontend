'use client'
import React, { useState } from 'react'
import SearchBrand from './SearchBrand'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export const SearchButton = ({ otherClasses }: { otherClasses: string }) => {
	return (
		<button type='submit' className={`-ml-3 z-10 ${otherClasses}`}>
			<Image
				src={'/magnifying-glass.svg'}
				alt={'magnifying glass'}
				width={40}
				height={40}
				className='object-contain'
			/>
		</button>
	)
}

const SearchBar = () => {
	const [brand, setBrand] = useState('')
	const [Model, setModel] = useState('')

	const Router = useRouter()
	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (brand.trim() === '' && Model.trim() === '') {
			return alert('Please provide some input')
		}

		updateSearchParams(Model.toLowerCase(), brand.toLowerCase())
	}
	const updateSearchParams = (Model: string, brand: string) => {
		// Create a new URLSearchParams object using the current URL search parameters
		const searchParams = new URLSearchParams(window.location.search)

		// Update or delete the 'model' search parameter based on the 'model' value
		if (Model) {
			searchParams.set('model', Model)
		} else {
			searchParams.delete('model')
		}

		// Update or delete the 'brand' search parameter based on the 'brand' value
		if (brand) {
			searchParams.set('brand', brand)
		} else {
			searchParams.delete('brand')
		}

		// Generate the new pathname with the updated search parameters
		const newPathname = `${window.location.pathname}?${searchParams.toString()}`

		Router.push(newPathname)
	}
	return (
		<form className='searchbar' onSubmit={handleSearch}>
			<div className='searchbar__item'>
				<SearchBrand brand={brand} setBrand={setBrand} />
				<SearchButton otherClasses='sm:hidden' />
			</div>
			<div className='searchbar__item'>
				<Image
					src='/model-icon.png'
					width={25}
					height={25}
					className='absolute w-[20px] h-[20px] ml-4'
					alt='car model'
				/>
				<input
					type='text'
					name='model'
					value={Model}
					onChange={(e) => setModel(e.target.value)}
					placeholder='Tiguan...'
					className='searchbar__input'
				/>
				<SearchButton otherClasses='sm:hidden' />
			</div>
			<SearchButton otherClasses='max-sm:hidden' />
		</form>
	)
}

export default SearchBar
