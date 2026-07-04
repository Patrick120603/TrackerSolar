import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import telemetrieRouter from './routes/telemetrieRoute.js' 
import operatorRouter from './routes/operatorRoute.js'     

const app = express()
const port = process.env.PORT || 4000

global.stareModSistem = 2;
global.manualUnghiH = 90;
global.manualUnghiV = 90;

connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors())

app.use('/api/admin', adminRouter)
app.use('/api/telemetrie', telemetrieRouter) 
app.use('/api/operator', operatorRouter)     

app.get('/', (req, res) => {
    res.send('API TRACKER SOLAR PE COGENERARE FUNCTIONEAZA PE PORTUL 4000')
})

app.listen(port, "0.0.0.0", () => console.log("Server Tracker Solar a pornit pe portul:", port))