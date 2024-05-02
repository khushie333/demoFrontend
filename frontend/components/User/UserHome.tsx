'use client'
import { useEffect, useState } from 'react'
import * as React from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
	AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import FormPassReset from './FormPassReset'
import Link from 'next/link'
import { Box } from '@mui/material'
import UpdateProfile from './UpdateProfile'
import { getCookie } from 'cookies-next'
import HandleNotLoggedIn from '../HandleNotLoggedIn'
import ViewBookmarks from './ViewBookmarks'
import { CarProps } from '@/types'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
		padding: theme.spacing(2),
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1),
	},
}))
const Accordion = styled((props: AccordionProps) => (
	<MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	'&:not(:last-child)': {
		borderBottom: 0,
	},
	'&::before': {
		display: 'none',
	},
}))
const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary
		expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
		{...props}
	/>
))(({ theme }) => ({
	backgroundColor:
		theme.palette.mode === 'dark'
			? 'rgba(255, 255, 255, .05)'
			: 'rgba(0, 0, 0, .03)',
	flexDirection: 'row-reverse',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(90deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	padding: theme.spacing(2),
	borderTop: '1px solid rgba(0, 0, 0, .125)',
}))
export default function UserHome() {
	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

	const [jwt, setjwt] = useState('')
	const [message, setMessage] = useState('')
	const [open, setOpen] = React.useState(true)

	const [expanded, setExpanded] = React.useState<string | false>('')
	const handleChange =
		(panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
			setExpanded(newExpanded ? panel : false)
		}
	const handleClickOpen = () => {
		setOpen(true)
	}
	const handleClose = () => {
		setOpen(false)
	}
	useEffect(() => {
		;(async () => {
			try {
				const response = await fetch(`${BASE_URL}/loggedinuser`, {
					credentials: 'include',
				})
				const content = await response.json()

				setMessage(`Hi ${content.name}`)
			} catch (e) {
				setMessage('You are not logged in')
			}
		})()
	})
	useEffect(() => {
		const token = getCookie('token')

		if (token) {
			setjwt(token)
		}
	}, [jwt])

	return (
		<>
			{jwt?.length !== 0 && (
				<>
					<Button variant='outlined' onClick={handleClickOpen}>
						Open dialog
					</Button>
					<BootstrapDialog
						onClose={handleClose}
						sx={{
							'&.MuiDialog-root': {
								backgroundImage:
									'url(https://getwallpapers.com/wallpaper/full/4/4/f/764228-wallpaper-of-sports-cars-1920x1080-for-xiaomi.jpg)',
							},
						}}
						aria-labelledby='customized-dialog-title'
						open={true}
					>
						<DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
							{message}
						</DialogTitle>
						<IconButton
							aria-label='close'
							onClick={handleClose}
							sx={{
								position: 'absolute',
								right: 8,
								top: 8,
								color: (theme) => theme.palette.grey[500],
							}}
						>
							{' '}
							<Link href='/'>
								<CloseIcon />
							</Link>
						</IconButton>
						<DialogContent dividers>
							<Accordion
								expanded={expanded === 'panel1'}
								onChange={handleChange('panel1')}
							>
								<AccordionSummary
									aria-controls='panel1d-content'
									id='panel1d-header'
								>
									<Typography style={{ margin: '16px 0' }}>
										Reset Password
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<FormPassReset />
								</AccordionDetails>
							</Accordion>
							<Accordion
								expanded={expanded === 'panel2'}
								onChange={handleChange('panel2')}
							>
								<AccordionSummary
									aria-controls='panel2d-content'
									id='panel2d-header'
								>
									Update Profile
								</AccordionSummary>
								<AccordionDetails>
									<UpdateProfile />
								</AccordionDetails>
							</Accordion>
							<Accordion
								expanded={expanded === 'panel3'}
								onChange={handleChange('panel3')}
							>
								<AccordionSummary
									aria-controls='panel2d-content'
									id='panel2d-header'
								>
									View Bookmarks
								</AccordionSummary>
								<AccordionDetails>
									<ViewBookmarks setOpen={setOpen} />
								</AccordionDetails>
							</Accordion>
						</DialogContent>

						<DialogActions
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'center',
							}}
						>
							<Link href='/ViewCars'>
								<Box
									textAlign='center'
									style={{
										fontWeight: 600,
									}}
								>
									<Button
										variant='contained'
										style={{
											fontWeight: 600,
										}}
									>
										View My Cars
									</Button>
								</Box>
							</Link>
							<Link href='/FormCreateCar'>
								<Box textAlign='center'>
									<Button
										variant='contained'
										style={{
											fontWeight: 600,
										}}
									>
										Add Car for Auction
									</Button>
								</Box>
							</Link>
						</DialogActions>
					</BootstrapDialog>
				</>
			)}
			{jwt?.length === 0 && <HandleNotLoggedIn />}
		</>
	)
}
