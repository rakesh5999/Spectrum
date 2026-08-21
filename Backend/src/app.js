import express from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import authRoutes from "./routes/auth.route.js"

const app = express()
app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())
app.use("/api/auth", authRoutes)


export default app