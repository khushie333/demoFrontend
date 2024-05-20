'use client'
import React, { useEffect, useState } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import StarIcon from '@mui/icons-material/Star'
import Badge from '@mui/material/Badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCookie } from 'cookies-next'

const page = () => {
	const router = useRouter()
	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
	const [isAdmin, setAdmin] = useState(false)
	const [notificationLength, setNotificationLength] = useState(0)
	useEffect(() => {
		const checkisAdmin = async () => {
			try {
				const token = getCookie('token')
				if (token) {
					const message = getCookie('message')
					const status = getCookie('status')

					const response = await fetch(`${BASE_URL}/user/getUserDatafromid`, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					})

					if (response.ok) {
						const userData = await response.json()

						if (userData?.isAdmin) {
							// Redirect to admin dashboard
							setAdmin(true)
						} else {
							// Redirect to regular user dashboard
							router.replace('/')
							setAdmin(false)
						}
					} else {
						console.error('Failed to fetch user data')
					}
				} else {
					throw new Error('Invalid authentication')
				}
			} catch (error: any) {
				console.error('Login error:', error.message)
			}
		}
		const fetchNotificationLength = async () => {
			try {
				// Fetch notification length from your backend

				const response = await fetch(`${BASE_URL}/notifications/user`, {
					headers: {
						Authorization: `Bearer ${getCookie('token')}`,
					},
				})

				if (response.ok) {
					const data = await response.json()
					const uniqueData = Array.from(
						new Set(data.map((a: any) => a._id))
					).map((id) => {
						return data.find((a: any) => a._id === id)
					})
					console.log(uniqueData)
					setNotificationLength(uniqueData.length)
				}
			} catch (error) {
				console.error('Error fetching notification length:', error)
			}
		}

		checkisAdmin()
		if (isAdmin) {
			fetchNotificationLength()
		}
	}, [isAdmin])
	return (
		<>
			{isAdmin && (
				<div className='relative flex flex-col justify-center min-h-screen overflow-hidden'>
					<div className='w-full p-6 m-auto bg-white rounded-md  ring-2 ring-blue-700 lg:max-w-xl'>
						<h3 className='text-3xl font-semibold text-center text-blue-700 underline uppercase'>
							Welcome Admin!
						</h3>
						<List
							sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
							aria-label='contacts'
						>
							<ListItem disablePadding>
								<Link href={'/Admin/ViewUsers'}>
									<ListItemButton>
										<ListItemIcon>
											<StarIcon />
										</ListItemIcon>
										<ListItemText primary='View Users' />
									</ListItemButton>
								</Link>
							</ListItem>
							<ListItem disablePadding>
								<Link href={'/Admin/ViewNewCars'}>
									<ListItemButton>
										<ListItemIcon>
											<Badge
												badgeContent={
													notificationLength !== 0 ? notificationLength : '0'
												}
												color='error'
											>
												<StarIcon />
											</Badge>
										</ListItemIcon>
										<ListItemText primary='Cars to Approve' />
									</ListItemButton>
								</Link>
							</ListItem>
						</List>
					</div>
				</div>
			)}
			<div className='hero__image-container'>
				<div className='hero__image-overlay' />
			</div>
		</>
	)
}

export default page
