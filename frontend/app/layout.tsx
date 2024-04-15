import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Provider } from 'react-redux'

import './globals.css'
import { Footer, Navbar, ToastContainer } from '@/components'

import { Providers } from '@/components/Providers'

//const inter = Inter({ subsets: ["latin"] });

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
