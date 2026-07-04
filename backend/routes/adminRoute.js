import express from 'express'
import { loginAdmin } from '../controllers/adminController.js'
import authAdmin from '../middlewares/authAdmin.js'

const adminRouter = express.Router()

adminRouter.post('/login', loginAdmin)

adminRouter.get('/dashboard-stats', authAdmin, (req, res) => {
    res.json({ success: true, message: "Sistemul solar funcționează în parametri optimi." })
})

export default adminRouter