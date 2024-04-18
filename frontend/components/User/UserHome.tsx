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
	const [message, setMessage] = useState('')
	const [open, setOpen] = React.useState(false)
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

	//	const [auth, setAuth] = useState(false)

	useEffect(() => {
		;(async () => {
			try {
				const response = await fetch('http://localhost:5000/api/loggedinuser', {
					credentials: 'include',
				})
				const content = await response.json()
				setMessage(`Hi ${content.name}`)
			} catch (e) {
				setMessage('You are not logged in')
			}
		})()
	})

	return (
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
				{/* <div className='relative flex flex-col justify-center min-h-screen overflow-hidden'>
				<div className='w-full p-6 m-auto bg-white rounded-md shadow-xl shadow-blue-300 ring-2 ring-blue-700 lg:max-w-xl'>
					<h1 className='text-3xl font-semibold text-center text-blue-700 '></h1>
				</div>
			</div> */}

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
							<Typography>
								<FormPassReset />
							</Typography>
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
							<Typography>Collapsible Group Item #2</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
								eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
								eget.
							</Typography>
						</AccordionDetails>
					</Accordion>
					<Accordion
						expanded={expanded === 'panel3'}
						onChange={handleChange('panel3')}
					>
						<AccordionSummary
							aria-controls='panel3d-content'
							id='panel3d-header'
						>
							<Typography>Collapsible Group Item #3</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
								eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
								eget.
							</Typography>
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
	)
}
