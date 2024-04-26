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

import Link from 'next/link'
import { Box } from '@mui/material'

import contextFun from '@/utils/Context'
import { useContext } from 'react'
import { getCookie } from 'cookies-next'

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
				<DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
					Not Logged In
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
					<Link href='/'>
						<CloseIcon />
					</Link>
				</IconButton>
				<DialogContent dividers>
					<Typography>You are not loggedIn to access this page</Typography>
				</DialogContent>

				<DialogActions
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}
				>
					<Link href='/SignIn'>
						<Box textAlign='center'>
							<Button
								variant='contained'
								style={{
									fontWeight: 600,
								}}
							>
								Sign In
							</Button>
						</Box>
					</Link>
				</DialogActions>
			</BootstrapDialog>
		</>
	)
}
