import { Router } from 'express'
import AdminController from '../controllers/admin.controller'

const router = Router()
router.get('/user/car/:userID', AdminController.viewCarsbyUserId)
router.post('/admin/isApproved/:carId', AdminController.approveCar)
router.post('/admin/disApproved/:carId', AdminController.disapproveCar)

router.get('/admin/newcars', AdminController.ViewNewCar)

router.put('/admin/:userId', AdminController.deactivateUserHandler)
router.put('/admin/activate/:userId', AdminController.activateUserHandler)

export default router
