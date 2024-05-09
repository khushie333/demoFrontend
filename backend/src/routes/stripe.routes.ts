import { Router } from 'express'
import express from 'express'
import createpayment from '../controllers/ paymentController'
const router = express.Router()
router.post('/createPayment', createpayment)

export default router
