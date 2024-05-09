import { Request, Response } from 'express'

import createPaymentIntent from './stripeService'
async function createpayment(req: Request, res: Response) {
	try {
		const { amount, customerId } = req.body // Assume amount and customerId are sent in the body of the request
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
