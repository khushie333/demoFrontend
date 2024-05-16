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
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import axios from 'axios'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { getCookie } from 'cookies-next'
import { HandleNotLoggedIn } from '@/components'
interface FinalizedBids {
	[carID: string]: boolean
}
function Row({
	row,
	row2,
	username,
	email,
	ownerEmail,
	ownerPhone,
	carID,
}: any) {
	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

	const [open, setOpen] = React.useState(false)
	const [openDialog, setOpenDialog] = React.useState(false)
	const [finalizedBids, setFinalizedBids] = React.useState<FinalizedBids>({})

	const [dialogData, setDialogData] = React.useState({
		email: '',
		bidAmount: 0,
		Model: '',
		brand: '',
		ownerEmail: '',
		ownerPhone: '',
		carID: '',
	})
	const handleSend = async (
		email: string,
		bidAmount: number,
		Model: string,
		brand: string,
		ownerEmail: string,
		ownerPhone: string,
		carID: string
	) => {
		try {
			const response = await axios.post(
				`${BASE_URL}/bids/sendBidFinalizeEmail`,
				dialogData
			)

			if (response) {
				setOpenDialog(false)
				setFinalizedBids((prev) => ({ ...prev, [dialogData.carID]: true }))
				toast.success('Bid finalized successfully!')
			} // Close the dialog
		} catch (error) {
			console.error('Error sending bid finalization:', error)
		}
	}
	const handleOpenDialog = (
		email: string,
		bidAmount: number,
		Model: string,
		brand: string,
		ownerEmail: string,
		ownerPhone: string,
		carID: string
	) => {
		setDialogData({
			email,
			bidAmount,
			Model,
			brand,
			ownerEmail,
			ownerPhone,
			carID,
		})
		setOpenDialog(true)
	}
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
										<TableCell style={{ fontSize: '1rem' }}>Email</TableCell>

										<TableCell align='right' style={{ fontSize: '1rem' }}>
											Amount
										</TableCell>
										<TableCell align='right' style={{ fontSize: '1rem' }}>
											Date
										</TableCell>
										<TableCell align='center' style={{ fontSize: '1rem' }}>
											Action
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{row2?.map((bid: any, index: number) => (
										<TableRow key={bid?._id}>
											<TableCell style={{ fontSize: '1rem' }}>
												{username[index + 1]}
											</TableCell>
											<TableCell style={{ fontSize: '1rem' }}>
												{email[index + 1]}
											</TableCell>
											<TableCell align='right' style={{ fontSize: '1rem' }}>
												{bid?.amount}
											</TableCell>
											<TableCell align='right' style={{ fontSize: '1rem' }}>
												{format(new Date(bid.createdAt), 'PPP')}
											</TableCell>
											<TableCell align='center' style={{ fontSize: '1rem' }}>
												<button
													onClick={() =>
														handleOpenDialog(
															email[index + 1],
															bid?.amount,
															row?.brand,
															row?.Model,
															ownerEmail,
															ownerPhone,
															carID
														)
													}
													className='w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 hover:bg-blue-700'
													disabled={finalizedBids[carID]}
												>
													Go with this bid
												</button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
			<Dialog
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle id='alert-dialog-title'>
					{'Confirm Bid Finalization'}
				</DialogTitle>
				<DialogContent>
					<DialogContentText
						id='alert-dialog-description'
						fontWeight={600}
						fontSize={'20px'}
					>
						Are you sure you want to go with this bid of {dialogData.bidAmount}{' '}
						on {dialogData.Model} {dialogData.brand}?<br /> By clicking OK we
						will notify the bidder and your car will be removed from the
						auction!
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDialog(false)}>Cancel</Button>
					<Button
						onClick={() =>
							handleSend(
								dialogData.email,
								dialogData.bidAmount,
								dialogData.Model,
								dialogData.brand,
								dialogData.ownerEmail,
								dialogData.ownerPhone,
								dialogData.carID
							)
						}
						autoFocus
					>
						OK
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default function CollapsibleTable() {
	const [carDetails, setCarDetails] = useState()
	const [bids, setBids] = useState()
	const [carID, setcarId] = useState('')
	const [ownerID, setOwnerID] = useState('')
	const [usernames, setUsernames] = useState<string[]>([])
	const [emails, setEmails] = useState<string[]>([])
	const [ownerEmails, setOwnerEmails] = useState()
	const [ownerPhone, setOwnerPhone] = useState()
	const role = getCookie('role')

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
					// console.log('data of car:', data)
					setCarDetails(data)
					const userid = data.user
					// console.log('userid:', userid)
					setOwnerID(userid)
					// console.log('ownerid:', ownerID)
				}
			} catch (error) {
				console.error('Error fetching car details:', error)
			}
		}
		// console.log('ownerid:', ownerID)

		const fetchownerdetails = async () => {
			try {
				if (ownerID) {
					// Check if carID is available before fetching data
					const response = await axios.get(`${BASE_URL}/user/${ownerID}`)
					const data = response.data

					if (data) {
						setOwnerEmails(data.email)
						setOwnerPhone(data.phone)
					}
				}
			} catch (error) {
				console.error('Error fetching bids:', error)
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
						//console.log(data.bids)
						const userids: string[] = data.bids.map((bid: any) => bid.user)
						//console.log(userids)

						userids?.forEach((id) => {
							userIds.push(id)
						})
						//console.log(userIds)
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
				const emails = []
				for (const userId of userIds) {
					const response = await axios.get(`${BASE_URL}/user/${userId}`)

					userNames.push(response.data.name)
					emails.push(response.data.email)
				}

				// Set the usernames in the state
				setUsernames(userNames)
				setEmails(emails)
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
			fetchownerdetails()
		}
	}, [carID, ownerID])

	return (
		<>
			{role === 'user' && (
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
													<TableCell style={{ fontSize: '1rem' }}>
														Bids
													</TableCell>
													<TableCell style={{ fontSize: '1rem' }}>
														brand
													</TableCell>
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
												<Row
													row={carDetails}
													row2={bids}
													username={usernames}
													email={emails}
													ownerEmail={ownerEmails}
													ownerPhone={ownerPhone}
													carID={carID}
												/>
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
			)}
			{role === '' && <HandleNotLoggedIn />}
		</>
	)
}
