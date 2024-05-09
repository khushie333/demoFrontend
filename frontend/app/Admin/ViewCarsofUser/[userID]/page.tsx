'use client'
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import DeleteForeverIcon from '@mui/icons-material/DeleteTwoTone'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import { format } from 'date-fns'
import { RiEdit2Line } from 'react-icons/ri'
import { IoEye } from 'react-icons/io5'
import Link from 'next/link'
import Router from 'next/navigation'
import { useRouter } from 'next/navigation'
import { ToastError } from '@/components/ToastContainer'
interface Car {
	_id: string
	images: string
	brand: string
	Model: string
	desc: string
	owner: string
	baseAmount: number
	bidStartDate: Date
	bidEndDate: Date
	deleted: boolean
}
const page = () => {
	// 	const [cars, setCars] = useState<Car[]>([])
	// 	const [jwt, setjwt] = useState('')
	// 	const [open, setOpen] = React.useState(false)
	// 	const [isDataEmpty, setIsDataEmpty] = useState(true)
	// 	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
	// 	const router = useRouter()
	// const token = getCookie('token')
	// 	useEffect(() => {
	// 		if (token) {
	// 			setjwt(token)
	// 		}
	// 		const fetchCars = async () => {
	// 			try {
	// 				const response = await axios.get(`${BASE_URL}/user/viewCarsOfUser`, {
	// 					headers: {
	// 						Authorization: `Bearer ${token}`,
	// 					},
	// 				})
	// 				setCars(response.data)

	// 				setIsDataEmpty(false)
	// 			} catch (error) {
	// 				console.error('Error fetching cars', error)
	// 			}
	// 		}

	// 		fetchCars()
	// 	}, [])
	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

	const [cars, setCars] = useState([])
	const [jwt, setjwt] = useState('')

	const token = getCookie('token')

	useEffect(() => {
		const parts = window.location.href.split('/')
		const userID = parts[5]

		if (token) {
			setjwt(token)
		}
		const fetchCars = async () => {
			try {
				const response = await axios.get(`${BASE_URL}/user/car/${userID}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				setCars(response.data)
			} catch (error) {
				ToastError('error fetching cars')
			}
		}

		fetchCars()
	}, [])

	return (
		<div className=' flex flex-col justify-center min-h-screen overflow-hidden'>
			<br />
			<br />

			<div className='w-full p-6 m-auto bg-white rounded-md shadow-xl mt-36  shadow-blue-300 ring-2 ring-blue-700 lg:max-w-fit'>
				<h1 className='text-2xl font-bold text-center text-blue-700 uppercase '>
					View Cars of user
				</h1>
				<div style={{ fontSize: '2rem' }}>
					<TableContainer component={Paper}>
						<Table aria-label='collapsible table'>
							<TableHead>
								<TableRow>
									<TableCell
										component='th'
										scope='row'
										style={{ fontSize: '1rem' }}
									>
										IMAGES
									</TableCell>
									<TableCell align='right' style={{ fontSize: '1rem' }}>
										Brand
									</TableCell>
									<TableCell align='right' style={{ fontSize: '1rem' }}>
										Model
									</TableCell>
									<TableCell align='right' style={{ fontSize: '1rem' }}>
										desc&nbsp;
									</TableCell>
									<TableCell align='right' style={{ fontSize: '1rem' }}>
										owner&nbsp;
									</TableCell>
									<TableCell align='right' style={{ fontSize: '1rem' }}>
										baseAmount&nbsp;
									</TableCell>
									<TableCell align='right' style={{ fontSize: '1rem' }}>
										bidStartDate&nbsp;
									</TableCell>
									<TableCell align='right' style={{ fontSize: '1rem' }}>
										bidEndDate&nbsp;
									</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{cars.map((car: any) => (
									<TableRow key={car._id}>
										<TableCell>
											{car.images && car.images.length > 0 ? (
												<img
													src={`http://localhost:5000/${car.images[0]}`}
													alt={`${car.brand.trim()} ${car.Model}`}
													style={{ width: '100px', height: '100px' }}
												/>
											) : (
												<span>No Image Available</span>
											)}
										</TableCell>
										<TableCell align='right' style={{ fontSize: '1rem' }}>
											{car.brand}
										</TableCell>
										<TableCell align='right' style={{ fontSize: '1rem' }}>
											{car.Model}
										</TableCell>
										<TableCell align='right' style={{ fontSize: '1rem' }}>
											{car.desc}
										</TableCell>
										<TableCell align='right' style={{ fontSize: '1rem' }}>
											{car.owner}
										</TableCell>
										<TableCell align='right' style={{ fontSize: '1rem' }}>
											{car.baseAmount}
										</TableCell>
										<TableCell align='right' style={{ fontSize: '1rem' }}>
											{format(new Date(car.bidStartDate), 'PPP')}
										</TableCell>
										<TableCell align='right' style={{ fontSize: '1rem' }}>
											{format(new Date(car.bidEndDate), 'PPP')}
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
	)
}

export default page
