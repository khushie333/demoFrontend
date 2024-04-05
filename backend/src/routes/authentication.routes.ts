import { Router } from 'express'
import authenticateUser from '../middlewares/authenticate.middleware'

import loginController from '../controllers/authentication/login.controller'
//import ResetPasswordEmail from '../controllers/authentication/resetpasswordemail.controller'
const router = Router()

// Define routes
router.post('/login', loginController.userLogin)
router.post('/changepassword', authenticateUser, loginController.changePassword)

export default router
