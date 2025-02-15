import express from 'express'
import bidRoutes from '../controllers/bid.controller'

const router = express.Router()
router.post('/bids/sendBidFinalizeEmail', bidRoutes.bidFinalization)
router.post('/bids/:carId', bidRoutes.addBid)
router.get('/bids/:carId', bidRoutes.getAllBids)
router.get('/bids/getMaxBid/:carId', bidRoutes.getMaxBid)
router.get('/bids/userBidHistory/:userId', bidRoutes.userBidHistory)
router.delete('/bids/:bidId', bidRoutes.deleteBid)

export default router
