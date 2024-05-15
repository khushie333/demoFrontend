import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { default as axios } from 'axios'
import ToastContainer from '@/components/ToastContainer'
import { deleteCookie, setCookie } from 'cookies-next'
import api from '../axiosinterceptor/page'
import { ToastError, ToastSuccess } from '@/components/ToastContainer'
import { useRouter } from 'next/navigation'

//base url for backend
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

//user initial state
const initialState = {
	user: [],
	error: null,
	isLoggedIn: false,
}
interface formValue {
	email: string
	password: string
}
//register new user
export const userRegister = createAsyncThunk(
	'userRegister',
	async (val: object) => {
		try {
			const createUser = await axios.post(`${BASE_URL}/user`, val)
			ToastSuccess(createUser.data.message)
			return createUser.data
		} catch (error: any) {
			ToastError(error.response.data.message)
			throw error.response.data
		}
	}
)

//login user
export const userLogin = createAsyncThunk('userLogin', async (val: object) => {
	try {
		const existingUser = await axios.post(`${BASE_URL}/login`, val)
		const data = await existingUser.data

		ToastSuccess(data.message)
		setCookie('token', data?.token)
		setCookie('status', data?.status)
		setCookie('message', data?.message)

		//setCookie('hello', 'hello')
		return data
	} catch (error: any) {
		ToastError(error.response.data.message)
		throw error?.response?.data
	}
})
export const addCar = createAsyncThunk(
	'addCar',
	async (payload: { data: object; token: string }) => {
		try {
			const { data, token } = payload
			// console.log('data======', data)
			const createCar = await axios.post(`${BASE_URL}/car`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			})
			ToastSuccess('Your car has been added for Auction')
			return createCar.data
		} catch (error: any) {
			ToastError(error.response.data.message)
			throw error.response.data
		}
	}
)

export const updateUserPassword = createAsyncThunk(
	'updateUserPassword',
	async (payload: { data: object; token: string }) => {
		try {
			const { data, token } = payload
			const response = await api.post('/changepassword', data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			const responseData = response.data
			ToastSuccess(responseData.message)
			return responseData
		} catch (error: any) {
			ToastError(error.response.data.message)
			throw error?.response?.data
		}
	}
)
//get user information
export const getUserProfile = createAsyncThunk('getUserProfile', async () => {
	try {
		const existingUser = await api.get(`/loggedinuser`, {
			withCredentials: true,
		})
		const data = await existingUser.data

		return data.data
	} catch (error: any) {
		ToastError(error.response.data.message)
		throw error?.response?.data
	}
})

//update user profile
export const updateUserProfile = createAsyncThunk(
	'updateUserProfile',
	async (payload: { data: object; token: string }) => {
		try {
			const { data, token } = payload
			const response = await api.put('/user/profile', data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			const responseData = response.data
			ToastSuccess(responseData.message)
			return responseData
		} catch (error: any) {
			ToastError(error.response.data.message)
			throw error?.response?.data
		}
	}
)
export const updateCar = createAsyncThunk(
	'updateCar',
	async (payload: { carID: any; data: object; token: any }) => {
		try {
			const { carID, data, token } = payload
			const response = await api.put(`/car/${carID}`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			})
			const responseData = response.data
			ToastSuccess(responseData.message)
			return responseData
		} catch (error: any) {
			ToastError(error.response.data.message)
			throw error?.response?.data
		}
	}
)

//user slice
const UserSlice: any = createSlice({
	name: 'user',
	initialState,
	reducers: {
		login(state) {
			state.isLoggedIn = true
		},
		logout: (state: any, action: any) => {
			console.log('logoutreducer called')
			deleteCookie('token')
			deleteCookie('status')
			deleteCookie('message')
			state.isLoggedIn = false
		},
	},
	extraReducers: (builder: any) => {
		builder
			.addCase(userRegister.pending, (state: any) => {
				state.status = 'loading'
			})
			.addCase(userRegister.fulfilled, (state: any, action: any) => {
				state.status = 'succeeded'
			})
			.addCase(userRegister.rejected, (state: any, action: any) => {
				state.status = 'failed'
			})
			.addCase(userLogin.pending, (state: any) => {
				state.status = 'loading'
				state.isLoggedIn = true
			})
			.addCase(userLogin.fulfilled, (state: any, action: any) => {
				state.status = 'succeeded'
				state.isLoggedIn = true
				// state.user = action.payload.data
			})
			.addCase(userLogin.rejected, (state: any, action: any) => {
				state.status = 'failed'
			})
			.addCase(getUserProfile.pending, (state: any) => {
				state.status = 'loading'
			})
			.addCase(getUserProfile.fulfilled, (state: any, action: any) => {
				state.status = 'succeeded'
			})
			.addCase(getUserProfile.rejected, (state: any, action: any) => {
				state.status = 'failed'
			})
			.addCase(updateUserProfile.pending, (state: any) => {
				state.status = 'loading'
			})
			.addCase(updateUserProfile.fulfilled, (state: any, action: any) => {
				state.status = 'succeeded'
			})
			.addCase(updateUserProfile.rejected, (state: any, action: any) => {
				state.status = 'failed'
			})
			.addCase(updateUserPassword.pending, (state: any) => {
				state.status = 'loading'
			})
			.addCase(updateUserPassword.fulfilled, (state: any, action: any) => {
				state.status = 'succeeded'
			})
			.addCase(updateUserPassword.rejected, (state: any, action: any) => {
				state.status = 'failed'
			})
	},
})

export const { login, logout } = UserSlice.actions
export const selectIsLoggedIn = (state: any) => state.user.isLoggedIn
export default UserSlice.reducer
