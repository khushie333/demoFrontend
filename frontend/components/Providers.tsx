'use client'
import store from '@/app/lib/store/page'
import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import contextFun from '@/utils/Context'
import { getCookie } from 'cookies-next'
export function Providers({ children }: any) {
	const [jwt, setJwt] = useState<any>('')
	const [content, setContent] = useState({})
	useEffect(() => {
		const token = getCookie('token') as string
		if (token) {
			setJwt(token)
		}
	}, [])
	const myContext = { jwt }

	return (
		<Provider store={store}>
			<contextFun.Provider value={{ jwt }}>{children}</contextFun.Provider>
		</Provider>
	)
}
