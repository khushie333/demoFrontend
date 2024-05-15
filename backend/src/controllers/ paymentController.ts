import { Request, Response } from 'express'

import createPaymentIntent from './stripeService'

//create  payment
async function createpayment(req: Request, res: Response) {
	try {
		const { amount, customerId } = req.body
		if (!amount || !customerId) {
			return res
				.status(400)
				.json({ error: 'Amount and Customer ID are required' })
		}
		const paymentIntent = await createPaymentIntent(amount, customerId)

		res.status(200).json(paymentIntent)
	} catch (error) {
		console.log('error: ', error)
		res.status(500).json({ error })
	}
}
export default createpayment
