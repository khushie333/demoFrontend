import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { default as axios } from 'axios'
import ToastContainer from '@/components/ToastContainer'
import { deleteCookie, setCookie } from 'cookies-next'
import api from '../axiosinterceptor/page'
import { ToastError, ToastSuccess } from '@/components/ToastContainer'

//base url for backend
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

//user initial state
const initialState = {
	user: [],
	userBook: [],
	bookLink: [],
	error: null,
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
			const createCar = await axios.post(`${BASE_URL}car`, data, {
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
			const { data, token } = payload // Assuming you pass both the data and the token in the payload
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
	async (updatedata: object) => {
		try {
			const existingUser = await api.patch('/user/update', updatedata)
			const data = await existingUser.data

			ToastSuccess(data.message)
			return data
		} catch (error: any) {
			ToastError(error.response.data.message)
			throw error?.response?.data
		}
	}
)

//update user password

//User find and View Subscription,Rented,Buy books
export const fetchUserBook = createAsyncThunk(
	'fetchUserBook',
	async (id: string) => {
		try {
			const getPackage = await api.get(`/book/user-book/${id}`)
			ToastSuccess(getPackage.data.message)

			return getPackage.data
		} catch (error: any) {
			ToastError(error.response.data.message)

			throw error.response.data
		}
	}
)

//get all user rented book
export const fetchUserRentedOrBuyBook = createAsyncThunk(
	'fetchUserRentedBook',
	async () => {
		try {
			const getPackage = await api.get('/book/user-book')
			const getData = await getPackage.data
			ToastSuccess(getPackage.data.message)
			return getData.data
		} catch (error: any) {
			ToastError(error.response.data.message)
			throw error.response.data
		}
	}
)

//user slice
const UserSlice: any = createSlice({
	name: 'user',
	initialState: {
		isLoggedIn: false,
	},
	reducers: {
		logout: (state: any, action: any) => {
			console.log('logoutreducer called')
			deleteCookie('token')
			deleteCookie('status')
			deleteCookie('message')
			state.isLoggedIn = false
			console.log(state.isLoggedIn)
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
			.addCase(fetchUserBook.pending, (state: any) => {
				state.status = 'loading'
			})
			.addCase(fetchUserBook.fulfilled, (state: any, action: any) => {
				state.status = 'succeeded'
				state.bookLink = action.payload
			})
			.addCase(fetchUserBook.rejected, (state: any, action: any) => {
				state.status = 'failed'
				state.error = action.error.message
			})
			.addCase(fetchUserRentedOrBuyBook.pending, (state: any) => {
				state.status = 'loading'
			})
			.addCase(
				fetchUserRentedOrBuyBook.fulfilled,
				(state: any, action: any) => {
					state.status = 'succeeded'
					state.userBook = action.payload
				}
			)
			.addCase(fetchUserRentedOrBuyBook.rejected, (state: any, action: any) => {
				state.status = 'failed'
				state.error = action.error.message
			})
	},
})

export const { login, logout } = UserSlice.actions
export const selectIsLoggedIn = (state: any) => state.user.isLoggedIn
export default UserSlice.reducer
