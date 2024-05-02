import { CarProps, filterProps, HomeProps } from '@/types'
import axios from 'axios'
import { useState } from 'react'
interface CarCardProps {
	car: CarProps
}
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function fetchcars(filters: filterProps, params: any) {
	const { brand, Model, baseAmount } = filters
	const { limit } = params
	const timestamp = new Date().getTime() // Current timestamp

	if (brand || Model) {
		let url = `${BASE_URL}/cars?`
		if (brand) {
			url += `search=${encodeURIComponent(brand)}&`
		}
		if (Model) {
			url += `search=${encodeURIComponent(Model)}&`
		}
		const response = await fetch(url, {
			headers: {
				'Cache-Control': 'no-store',
				Pragma: 'no-store',
			},
		})
		if (response.ok) {
			const result = await response.json()
			const carsArray = result.cars || []
			return carsArray
		} else {
			console.log('no response')
		}
	} else {
		const response = await fetch(`${BASE_URL}/car?limit=${limit}`, {
			headers: {
				'Cache-Control': 'no-store',
				Pragma: 'no-store',
			},
		})
		const result = await response.json()
		//console.log(result)
		return result
	}
}
interface CarDetailsProps {
	isOpen: boolean
	closeModel: () => void
	car: CarProps
}
export const updateSearchParams = (type: string, value: string) => {
	// Get the current URL search params
	const searchParams = new URLSearchParams(window.location.search)

	// Set the specified search parameter to the given value
	searchParams.set(type, value)

	// Set the specified search parameter to the given value
	const newPathname = `${window.location.pathname}?${searchParams.toString()}`

	return newPathname
}
export const fetchMaxBid = async ({ car }: CarCardProps) => {
	// const [maxBid, setMaxBid] = useState(null)

	try {
		const response = await axios.get(`${BASE_URL}/bids/getMaxBid/${car._id}`)
		// setMaxBid(response.data.maxBidAmount)
		if (response.data.maxBidAmount !== null) {
			return response
		}
	} catch (error) {
		console.error('Error fetching max bid:', error)
	}
}
