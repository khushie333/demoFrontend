'use client'
import React from 'react'
import GooglePayButton from '@google-pay/button-react'
import { ToastSuccess } from '@/components/ToastContainer'

const CheckoutPage: React.FC = () => {
	const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

	const url = window.location.href
	const [baseUrl, queryParams] = url.split('?')
	const queryParamsArray = queryParams.split('&')

	let brand = ''
	let model = ''
	let amount = ''
	for (const param of queryParamsArray) {
		const [key, value] = param.split('=')

		if (key === 'brand') {
			brand = value
		} else if (key === 'model') {
			model = value
		} else if (key === 'amount') {
			amount = value
		}
	}

	const handlePaymentData = (payment: any) => {
		ToastSuccess('Payment successful')
	}

	return (
		<div className='flex flex-col justify-center min-h-screen overflow-hidden'>
			<div className='w-full p-6 m-auto mt-56 items-center bg-white rounded-md shadow-xl shadow-blue-300 ring-2 ring-blue-700 lg:max-w-xl'>
				<div className='bg-white rounded-lg items-center shadow-lg p-8'>
					<h2 className='text-lg font-semibold mb-4'>Your Bid Summary</h2>
					<div className='flex justify-between mb-2'>
						<span>Car Name:</span>
						<span>
							{brand} {model}
						</span>
					</div>

					<div className='flex justify-between mb-4'>
						<span>Total Amount:</span>
						<span>{amount}</span>
					</div>

					<GooglePayButton
						environment='TEST'
						paymentRequest={{
							apiVersion: 2,
							apiVersionMinor: 0,
							allowedPaymentMethods: [
								{
									type: 'CARD',
									parameters: {
										allowedAuthMethods: ['CRYPTOGRAM_3DS', 'PAN_ONLY'],
										allowedCardNetworks: ['VISA', 'MASTERCARD'],
									},
									tokenizationSpecification: {
										type: 'PAYMENT_GATEWAY',
										parameters: {
											gateway: 'example',
											gatewayMerchantId: 'exampleGatewayMerchantId',
										},
									},
								},
							],
							merchantInfo: {
								merchantId: '12345678901234567890',
								merchantName: 'Apr',
							},
							transactionInfo: {
								totalPriceStatus: 'FINAL',
								totalPrice: '55.00',
								currencyCode: 'USD',
							},
						}}
						onLoadPaymentData={handlePaymentData}
						buttonSizeMode='fill'
						buttonType='pay'
					/>
				</div>
			</div>
			<div className='hero__image-container'>
				<div className='hero__image-overlay' />
			</div>
		</div>
	)
}

export default CheckoutPage
