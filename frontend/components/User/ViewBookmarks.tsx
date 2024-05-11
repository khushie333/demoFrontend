'use client'
import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import { CarProps } from '@/types'
import CarDetails from '../CarDetails'
import { useRouter } from 'next/navigation'
function generate(element: React.ReactElement) {
	return [0, 1, 2].map((value) =>
		React.cloneElement(element, {
			key: value,
		})
	)
}

const Demo = styled('div')(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
}))
const ViewBookmarks = ({ setOpen }: any) => {
	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

	const [bookmarkedCars, setBookmarkedCars] = useState<CarProps[]>([])
	const [selectedCar, setSelectedCar] = useState<CarProps | null>(null)
	const [dense, setDense] = React.useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const token = getCookie('token')
	const router = useRouter()

	useEffect(() => {
		if (token) {
			fetchBookmarkedCars()
		}
	}, [])
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	const fetchBookmarkedCars = async () => {
		try {
			const allCarsResponse = await axios.get<CarProps[]>(`${BASE_URL}/car`)
			const allCars: CarProps[] = allCarsResponse.data

			const response = await axios.get(`${BASE_URL}/bookmarks/user`, config)
			const bookmarks = response.data

			const bookmarkArray = bookmarks.bookmarks

			if (Array.isArray(bookmarkArray)) {
				const bookmarkedCarIds: string[] = bookmarkArray.map(
					(bookmark) => bookmark.car
				)
				const bookmarkedcar: CarProps[] = allCars.filter((car) =>
					bookmarkedCarIds.includes(car._id)
				)
				setBookmarkedCars(bookmarkedcar)
			}
		} catch (error) {
			console.error('Error fetching bookmarked cars:', error)
		}
	}
	const handleDeleteBookmark = async (bookmarkId: string) => {
		try {
			await axios.delete(`${BASE_URL}/bookmarks/${bookmarkId}`, config)
			setBookmarkedCars((prevBookmarkedCars) =>
				prevBookmarkedCars.filter((car) => car._id !== bookmarkId)
			)
		} catch (error) {
			console.error('Error deleting bookmark:', error)
		}
	}
	const handleCarClick = () => {
		router.replace('/')
	}

	const handleCloseCarDetails = () => {
		setIsOpen(false) // Close the modal
	}
	return (
		<Grid item xs={12} md={6}>
			<Typography variant='h6' component='div'>
				My bookmarks
			</Typography>
			<Demo>
				<List dense={dense}>
					{bookmarkedCars.map((car, index) => (
						<ListItem
							key={index}
							secondaryAction={
								<IconButton
									edge='end'
									aria-label='delete'
									onClick={() => handleDeleteBookmark(car._id)}
								>
									<DeleteIcon />
								</IconButton>
							}
						>
							<IconButton onClick={() => handleCarClick()}>
								<Avatar
									src={`http://localhost:5000/${car.images[0]}`}
									alt='Car'
									sx={{ width: 56, height: 56, marginRight: 2 }}
								/>

								<ListItemText
									primary={
										<span style={{ color: 'blue' }}>
											{' '}
											<b> {car.brand}</b> <b>{car.Model}</b>
										</span>
									}
								/>
							</IconButton>
						</ListItem>
					))}
				</List>
			</Demo>
		</Grid>
	)
}

export default ViewBookmarks
