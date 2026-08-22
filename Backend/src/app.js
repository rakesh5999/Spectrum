import express from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import authRoutes from "./routes/auth.route.js"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))


app.use("/api/auth", authRoutes)


export default app