import { error } from 'console'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

async function createPaymentIntent(
	amount: number,
	customerId: string
): Promise<Stripe.Response<Stripe.PaymentIntent>> {
	return await stripe.paymentIntents.create({
		amount: amount,
		currency: 'usd',
		payment_method_types: ['card'],
		payment_method: 'pm_card_visa',
		customer: customerId,
		confirmation_method: 'manual',
		confirm: true,
	})
}

export default createPaymentIntent
