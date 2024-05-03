'use client'
import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import DeleteForeverIcon from '@mui/icons-material/DeleteTwoTone'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import { format } from 'date-fns'
import { ToastSuccess } from '@/components/ToastContainer'

const Page = () => {
	// State to store bid history data
	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

	const [bidHistory, setBidHistory] = useState<any>([])
	// const parts = window.location.href.split('/')
	const [userID, setuserID] = useState<any>()
	const token = getCookie('token')

	useEffect(() => {
		const parts = window.location.href.split('/')
		const extractedUserID = parts[parts.length - 1]
		if (extractedUserID) {
			setuserID(extractedUserID)
			if (token) {
				fetchBidHistory()
			}
		}
	}, [userID])
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	// Function to fetch bid history data from the API
	const fetchBidHistory = async () => {
		try {
			console.log('userID:', userID)
			const response = await axios.get(
				`${BASE_URL}/bids/userBidHistory/${userID}`,
				config
			)
			const bidData = response.data.bids
			const bidsWithCarData = await Promise.all(
				bidData.map(async (bid: any) => {
					// Make API request to fetch car details using car ID
					const carResponse = await axios.get(`${BASE_URL}/car/${bid.car}`)
					const carData = carResponse.data

					// Combine car data with bid data
					return {
						...bid,
						carData: carData, // Assuming carData is the field where you store car details
					}
				})
			)

			setBidHistory(bidsWithCarData)
			//console.log(bidsWithCarData)
			//setBidHistory(response.data.bids)
		} catch (error) {
			console.error('Error fetching bid history:', error)
		}
	}

	const handleDelete = async (bidId: any) => {
		const confirmed = window.confirm(
			'Are you sure you want to delete this bid? clicking OK will remove your bid from this car'
		)
		if (!confirmed) {
			return
		}
		try {
			const response = await axios.delete(`${BASE_URL}/bids/${bidId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			if (response) {
				// If successful, update the local state to reflect the deletion
				setBidHistory(bidHistory.filter((bid: any) => bid._id !== bidId))
				ToastSuccess(response.data.message)
			} else {
				// If not successful, handle the error accordingly
				console.error('Failed to delete car')
			}
		} catch (error) {
			// Handle any network errors
			console.error('Error deleting car:', error)
		}
	}
	return (
		<>
			<div className=' flex flex-col justify-center min-h-screen overflow-hidden'>
				<br />
				<br />

				<div className='w-full p-6 m-auto bg-white rounded-md shadow-xl mt-36  shadow-blue-300 ring-2 ring-blue-700 lg:max-w-fit'>
					<h1 className='text-2xl font-bold text-center text-blue-700 uppercase '>
						view bid history
					</h1>
					<div style={{ fontSize: '2rem' }}>
						<TableContainer component={Paper}>
							<Table aria-label='collapsible table'>
								<TableHead>
									<TableRow>
										<TableCell align='right' style={{ fontSize: '1rem' }}>
											Brand
										</TableCell>
										<TableCell align='right' style={{ fontSize: '1rem' }}>
											Model
										</TableCell>

										<TableCell align='right' style={{ fontSize: '1rem' }}>
											bidAmount&nbsp;
										</TableCell>
										<TableCell align='right' style={{ fontSize: '1rem' }}>
											Created date&nbsp;
										</TableCell>
										<TableCell align='right' style={{ fontSize: '1rem' }}>
											DELETE&nbsp;
										</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{bidHistory.map((bid: any) => (
										<TableRow key={bid._id}>
											<TableCell align='right' style={{ fontSize: '1rem' }}>
												{bid.carData.brand}
											</TableCell>

											<TableCell align='right' style={{ fontSize: '1rem' }}>
												{bid.carData.Model}
											</TableCell>
											<TableCell align='right' style={{ fontSize: '1rem' }}>
												{bid.amount}
											</TableCell>

											<TableCell align='right' style={{ fontSize: '1rem' }}>
												{format(new Date(bid.createdAt), 'PPP')}
											</TableCell>
											<TableCell align='right'>
												<button
													onClick={() => handleDelete(bid._id)}
													className='w-full px-4 py-2 tracking-wide text-red-500 transition-colors duration-200 transhtmlForm rounded-md hover:bg-zinc-400 focus:outline-none'
												>
													<DeleteForeverIcon />
												</button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</div>
				</div>
				<br />
				<br />
			</div>
		</>
	)
}

export default Page
