'use client'
import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import BlockIcon from '@mui/icons-material/Block'
import axios from 'axios'
import { IoEye } from 'react-icons/io5'
import Link from 'next/link'

const page = () => {
	const [users, setUsers] = useState<any[]>([])

	const [currentPage, setCurrentPage] = useState(1)
	const usersPerPage = 5
	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${BASE_URL}/user`)
				const activeUsers = response.data.filter((user: any) => user.active)
				setUsers(activeUsers)
			} catch (error) {
				console.error('Error fetching users:', error)
			}
		}

		fetchUsers()
	}, [])

	// Logic to slice users based on current page and users per page
	const indexOfLastUser = currentPage * usersPerPage
	const indexOfFirstUser = indexOfLastUser - usersPerPage
	const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)

	// Function to handle pagination
	const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

	const deactivateUser = async (userId: string) => {
		try {
			const response = await axios.put(`${BASE_URL}/admin/${userId}`)
			if (response.data.success) {
				alert('User deactivated successfully')
				setUsers(users.filter((user: any) => user._id !== userId))
			} else {
				alert('Failed to deactivate user')
			}
		} catch (error) {
			console.error('Error deactivating user:', error)
			alert('Error deactivating user')
		}
	}

	return (
		<div className='flex flex-col justify-center min-h-screen overflow-hidden'>
			<br />
			<br />

			<div className='w-full p-6 m-auto bg-white rounded-md shadow-xl mt-24  shadow-blue-300 ring-2 ring-blue-700 lg:max-w-fit'>
				<h1 className='text-2xl font-bold text-center text-blue-700 uppercase'>
					View Users
				</h1>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} size='small' aria-label='user table'>
						<TableHead>
							<TableRow>
								<TableCell
									align='right'
									style={{ fontSize: '1rem', fontWeight: 600 }}
								>
									Username
								</TableCell>
								<TableCell
									align='right'
									style={{ fontSize: '1rem', fontWeight: 600 }}
								>
									Email
								</TableCell>
								<TableCell
									align='right'
									style={{ fontSize: '1rem', fontWeight: 600 }}
								>
									Phone
								</TableCell>
								<TableCell
									align='right'
									style={{ fontSize: '1rem', fontWeight: 600 }}
								>
									Address
								</TableCell>
								<TableCell
									align='right'
									style={{ fontSize: '1rem', fontWeight: 600 }}
								>
									View Cars of user
								</TableCell>
								<TableCell
									align='right'
									style={{ fontSize: '1rem', fontWeight: 600 }}
								>
									Actions
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{currentUsers.map((user) => (
								<TableRow key={user?._id}>
									<TableCell align='right' style={{ fontSize: '1rem' }}>
										{user?.name}
									</TableCell>
									<TableCell align='right' style={{ fontSize: '1rem' }}>
										{user?.email}
									</TableCell>
									<TableCell align='right' style={{ fontSize: '1rem' }}>
										{user?.phone}
									</TableCell>
									<TableCell align='right' style={{ fontSize: '1rem' }}>
										{user?.address}
									</TableCell>
									<TableCell align='center'>
										<Link href={`/Admin/ViewCarsofUser/${user._id}`}>
											<button className=' px-4 py-2 tracking-wide text-black transition-colors duration-200 transhtmlForm bg-white rounded-md hover:bg-slate-400 focus:outline-none'>
												<IoEye style={{ fontSize: '1.5rem' }} />
											</button>
										</Link>
									</TableCell>
									<TableCell align='right'>
										<button
											onClick={() => deactivateUser(user._id)}
											className='w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transhtmlForm bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-700'
										>
											<BlockIcon />
										</button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<div
					className='pagination'
					style={{
						marginLeft: '800px',
						textAlign: 'center',
						fontSize: '20px',
						textDecorationColor: 'blue',
					}}
				>
					{[...Array(Math.ceil(users.length / usersPerPage)).keys()].map(
						(number) => (
							<button
								key={number + 1}
								onClick={() => paginate(number + 1)}
								className={`${
									currentPage === number + 1 ? 'active' : ''
								} text-blue-700`}
							>
								<b> {number + 1}-</b>
							</button>
						)
					)}
				</div>
				<Link href={'/Admin/ViewBlockedUsers'}>
					<h6 className='pt-10 font-semibold text-center text-blue-700 underline uppercase'>
						View blocked users
					</h6>
				</Link>
			</div>
		</div>
	)
}

export default page
