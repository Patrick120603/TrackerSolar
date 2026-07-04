import express from 'express'
import { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile, 
    actualizeazaModSistem,
    actualizeazaUnghiuriSistem
} from '../controllers/operatorController.js'
import authUser from '../middlewares/authUser.js'

const operatorRouter = express.Router()

operatorRouter.post('/register', registerUser)
operatorRouter.post('/login', loginUser)

operatorRouter.post('/set-mod', actualizeazaModSistem)
operatorRouter.post('/set-unghiuri', actualizeazaUnghiuriSistem)

operatorRouter.get('/get-profile', authUser, getUserProfile)
operatorRouter.post('/update-profile', authUser, updateUserProfile)

export default operatorRouter