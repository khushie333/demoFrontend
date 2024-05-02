'use client'
import store from '@/app/lib/store/page'
import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import contextFun from '@/utils/Context'
import { getCookie } from 'cookies-next'
import io from 'socket.io-client'
import { ToastError, ToastSuccess } from './ToastContainer'
export function Providers({ children }: any) {
	// const socket = io('http://localhost:5000')
	// socket.on('notifyUpdate', (data) => {
	// 	console.log(data)
	// 	ToastError(data.message) // Or use a more sophisticated method to show notifications
	// })
	return <Provider store={store}>{children}</Provider>
}
