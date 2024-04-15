'use client'
import store from '@/app/lib/store/page'
import React from 'react'
import { Provider } from 'react-redux'

export function Providers({ children }: any) {
	return <Provider store={store}>{children}</Provider>
}
