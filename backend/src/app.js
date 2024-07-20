import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'
const app = express()

dotenv.config();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import 
import userRouter from './routes/user.routes.js'
import inventoryRouter from './routes/QrCode.routes.js'

// routes declaration 
app.use("/api/v1/user", userRouter);
app.use("/api/v1/inventory", inventoryRouter);
export default app;