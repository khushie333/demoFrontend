'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import Custombutton from './Custombutton'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'
import { getCookie } from 'cookies-next'
import { useSelector, useDispatch } from 'react-redux'
import { selectIsLoggedIn, login } from '@/app/lib/UserSlice/UserSlice'
import { ThunkDispatch } from '@reduxjs/toolkit'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Badge from '@mui/material/Badge'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import { green } from '@mui/material/colors'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { io } from 'socket.io-client'
const socket = io('http://localhost:5000')
interface Notification {
	_id: string
	car?: string
	user?: string
	message: string
	isread: boolean
}

const Navbar = () => {
	const [isConnected, setIsConnected] = React.useState(false)
	const [transport, setTransport] = React.useState('N/A')
	const [open, setOpen] = React.useState(false)
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
	const [selectedIndex, setSelectedIndex] = React.useState(1)
	const [notifications, setNotifications] = React.useState<Notification[]>([])
	const isLoggedIn = useSelector(selectIsLoggedIn)
	const token = getCookie('token')
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
	useEffect(() => {
		// Check token existence and dispatch login or logout actions accordingly
		if (token) {
			dispatch(login({ token }))
		}
	}, [token, dispatch])
	useEffect(() => {
		socket.on('notifyUpdate', (data) => {
			console.log('Received notification update:', data)
			setNotifications((prevNotifications) => [...prevNotifications, data])
		})
		socket.on('bidReceived', (notification) => {
			// console.log('New bid received:', notification)
			setNotifications((prevNotifications) => [
				...prevNotifications,
				notification,
			])
		})

		return () => {
			socket.off('newBid') // Cleanup listener on component unmount
		}
	}, [socket])

	// useEffect(() => {
	// 	// Listening for new bid notifications

	// }, [socket])
	const handleClose = () => {
		setOpen(false) // Close the Popover
		setAnchorEl(null)
	}
	const id = open ? 'simple-popover' : undefined

	const handleListItemClick = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		index: number
	) => {
		setSelectedIndex(index)
	}
	const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
		setOpen(!open) // Toggle the state of the Popover
		setAnchorEl(event.currentTarget)
		try {
			// Call backend API to fetch notifications for the user
			const response = await fetch(`${BASE_URL}/notifications/user`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			if (response.ok) {
				const data = await response.json()
				const uniqueData = Array.from(new Set(data.map((a: any) => a._id))).map(
					(id) => {
						return data.find((a: any) => a._id === id)
					}
				)
				setNotifications(uniqueData)
			}
		} catch (error) {
			console.error('Error fetching notifications:', error)
		}
	}
	const handlemarkAsRead =
		(notificationId: string) =>
		async (event: React.MouseEvent<HTMLButtonElement>) => {
			try {
				const response = await fetch(
					`${BASE_URL}/notifications/${notificationId}`,
					{
						method: 'DELETE',
					}
				)
				if (response.ok) {
					// Remove the notification from the list after marking it as read
					setNotifications((prevNotifications) =>
						prevNotifications.filter(
							(notification) => notification._id !== notificationId
						)
					)
				} else {
					console.error('Failed to mark notification as read')
				}
			} catch (error) {
				console.error('Error marking notification as read:', error)
			}
		}

	return (
		<header className='w-full absolute z-10 '>
			<nav className='max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 '>
				<Link href='/' className='flex justify-center items-center'>
					<Image
						src='/car1.svg'
						alt='car logo'
						width={150}
						height={25}
						className='object-contain'
					></Image>
				</Link>
				{isLoggedIn ? <LogoutButton /> : <LoginButton />}

				{isLoggedIn && (
					<div
						className='flex flex-row gap-1 mr-2 '
						style={{ alignItems: 'center' }}
					>
						<Link
							href={'/UserHome'}
							className='flex justify-center items-center'
							passHref
						>
							<Custombutton
								title='👤MyProfile'
								btnType='button'
								containerStyles='text-primary-blue rounded-full bg-white min-w-[130px]'
							/>
						</Link>
						<Badge
							badgeContent={
								notifications.length !== 0 ? notifications.length - 1 : '0'
							}
							color='error'
							onClick={handleClick}
						>
							<NotificationsIcon className='text-yellow-400' />

							<Popover
								id={id}
								open={open}
								anchorEl={anchorEl}
								onClose={handleClose}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'left',
								}}
								sx={{ width: '95%' }}
							>
								<Typography sx={{ p: 2 }}>
									<Box
										sx={{
											width: '100%',
											maxWidth: 360,
											bgcolor: 'background.paper',
										}}
									>
										<List component='nav' aria-label='secondary mailbox folder'>
											{notifications &&
												notifications.map((notification) => (
													<div className='flex flex-row'>
														<Link
															href='/ViewCars'
															className='text-blue-700 hover:text-indigo-700 hover:outline-2 hover:border-2'
														>
															<ListItemText
																key={notification._id}
																primary={notification.message}
															/>
														</Link>

														<button
															onClick={handlemarkAsRead(notification._id)}
															className='hover:border-2'
														>
															<CheckCircleOutlineIcon
																style={{
																	height: '30',
																	width: '30',
																	color: green[500],
																}}
															/>
														</button>
													</div>
												))}
											{notifications.length === 0 && (
												<Typography variant='h3'>
													<div className='flex flex-row'>
														<ListItemText primary='No Notifications yet' />
													</div>
												</Typography>
											)}
											<Divider />
										</List>
									</Box>
								</Typography>
							</Popover>
						</Badge>
					</div>
				)}
			</nav>
		</header>
	)
}

export default Navbar
