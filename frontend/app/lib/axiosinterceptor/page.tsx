import axios from 'axios'
import { getCookie } from 'cookies-next'

//create axios interceptor
const api = axios.create({
	//backend url link
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	timeout: 500000,
})

//set token role and status in headers of each request api call using interceptors
api.interceptors.request.use(
	(config) => {
		try {
			const userToken = getCookie('token')

			const userStatus = getCookie('status')
			if (userToken) {
				config.headers.token = `Bearer ${userToken}`
				config.headers.status = userStatus
			}
		} catch (error) {
			console.error('Error retrieving token from localStorage:', error)
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

export default api
