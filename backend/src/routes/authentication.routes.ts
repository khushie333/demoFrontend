import { Router } from 'express'
import authenticateUser from '../middlewares/authenticate.middleware'
import jwt from 'jsonwebtoken'
import loginController from '../controllers/authentication/login.controller'
//import ResetPasswordEmail from '../controllers/authentication/resetpasswordemail.controller'
const router = Router()

// Define routes
router.post('/login', loginController.userLogin)
router.post('/changepassword', authenticateUser, loginController.changePassword)
router.get('/loggedinuser', loginController.loggedinuser)
router.post('/logout', loginController.logoutUser)

export default router
