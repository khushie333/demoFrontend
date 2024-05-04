'use client'

import './globals.css'
import { Footer, Navbar, ToastContainer } from '@/components'

import { Providers } from '@/components/Providers'
export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<body className='relative'>
				<Providers>
					<ToastContainer
						position='top-right'
						autoClose={1500}
						hideProgressBar={false}
						closeOnClick
						pauseOnHover
						draggable
						theme='light'
					/>
					<Navbar />
					{children}
					<Footer />
				</Providers>
			</body>
		</html>
	)
}
