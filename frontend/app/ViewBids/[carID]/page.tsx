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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import axios from 'axios'

function Row({ row, row2, username }: any) {
	const [open, setOpen] = React.useState(false)

	return (
		<>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
				<TableCell>
					<IconButton
						aria-label='expand row'
						size='small'
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component='th' scope='row' style={{ fontSize: '1rem' }}>
					{row?.brand}
				</TableCell>
				<TableCell align='right' style={{ fontSize: '1rem' }}>
					{row?.Model}
				</TableCell>
				<TableCell align='right' style={{ fontSize: '1rem' }}>
					{row?.baseAmount}
				</TableCell>
				<TableCell align='right' style={{ fontSize: '1rem' }}>
					{row?.desc}
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout='auto' unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Typography variant='h6' gutterBottom component='div'>
								Bids
							</Typography>
							<Table size='small' aria-label='bids'>
								<TableHead>
									<TableRow>
										<TableCell style={{ fontSize: '1rem' }}>User</TableCell>
										<TableCell align='right' style={{ fontSize: '1rem' }}>
											Amount
										</TableCell>
										<TableCell align='right' style={{ fontSize: '1rem' }}>
											Date
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{row2?.map((bid: any, index: number) => (
										<TableRow key={bid?._id}>
											<TableCell style={{ fontSize: '1rem' }}>
												{username[index + 1]}
											</TableCell>
											<TableCell align='right' style={{ fontSize: '1rem' }}>
												{bid?.amount}
											</TableCell>
											<TableCell align='right' style={{ fontSize: '1rem' }}>
												{bid?.createdAt}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	)
}

export default function CollapsibleTable() {
	const [carDetails, setCarDetails] = useState()
	const [bids, setBids] = useState()
	const [carID, setcarId] = useState('')

	const [usernames, setUsernames] = useState<string[]>([])
	const [isUserLoading, setIsUserLoading] = useState(false)
	const userIds = ['']

	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const parts = window.location.href.split('/')

		setcarId(parts[4])
		const fetchCarDetails = async () => {
			try {
				if (carID) {
					// Check if carID is available before fetching data
					const response = await axios.get(`${BASE_URL}/car/${carID}`)
					const data = response.data

					setCarDetails(data)
				}
			} catch (error) {
				console.error('Error fetching car details:', error)
			}
		}

		const fetchBids = async () => {
			try {
				if (carID) {
					// Check if carID is available before fetching data
					const response = await axios.get(`${BASE_URL}/bids/${carID}`)
					const data = response.data

					if (data) {
						setBids(data.bids)
						console.log(data.bids)
						const userids: string[] = data.bids.map((bid: any) => bid.user)
						console.log(userids)
						///	console.log(userIds)
						userids?.forEach((id) => {
							userIds.push(id)
						})
						console.log(userIds)
					}
				}
			} catch (error) {
				console.error('Error fetching bids:', error)
			}
		}
		const fetchUserData = async () => {
			try {
				setIsUserLoading(true)

				const userNames = []

				for (const userId of userIds) {
					const response = await axios.get(`${BASE_URL}/user/${userId}`)

					userNames.push(response.data.name)
				}
				console.log('usernames:', userNames)
				// Set the usernames in the state
				setUsernames(userNames)

				setIsUserLoading(false)
			} catch (error) {
				console.error('Error fetching user:', error)
				setIsUserLoading(false)
			}
		}
		if (carID) {
			fetchCarDetails()
			fetchBids()
			fetchUserData()
		}
	}, [carID])

	return (
		<div className='flex flex-col justify-center min-h-screen overflow-hidden'>
			{isLoading ? (
				<p>Loading car details and bids...</p>
			) : (
				<>
					<br />
					<br />

					<div className='w-full p-6 m-auto bg-white rounded-md shadow-xl mt-36 shadow-blue-300 ring-2 ring-blue-700 lg:max-w-screen-lg'>
						<h1 className='text-2xl font-bold text-center text-blue-700 uppercase'>
							View Bids
						</h1>
						<div style={{ fontSize: '2rem' }}>
							<TableContainer component={Paper}>
								<Table aria-label='collapsible table'>
									<TableHead>
										<TableRow>
											<TableCell style={{ fontSize: '1rem' }}>Bids</TableCell>
											<TableCell style={{ fontSize: '1rem' }}>brand</TableCell>
											<TableCell align='right' style={{ fontSize: '1rem' }}>
												Model
											</TableCell>
											<TableCell align='right' style={{ fontSize: '1rem' }}>
												Amount
											</TableCell>
											<TableCell align='right' style={{ fontSize: '1rem' }}>
												Discription
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<Row row={carDetails} row2={bids} username={usernames} />
									</TableBody>
								</Table>
							</TableContainer>
						</div>
					</div>
					<br />
					<br />
				</>
			)}
		</div>
	)
}
