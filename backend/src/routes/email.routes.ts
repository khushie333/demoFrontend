import { Router } from 'express'

import ResetPasswordEmail from '../controllers/authentication/resetpasswordemail.controller'

const router = Router()
router.post('/sendResetPassword', ResetPasswordEmail.sendUserPassResetEmail)
router.post('/ResetPassword/:id/:token', ResetPasswordEmail.userPassReset)
export default router
