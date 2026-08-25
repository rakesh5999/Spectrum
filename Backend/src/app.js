import express from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import authRoutes from "./routes/auth.route.js"
import cors from "cors"
import passport from "passport"
import {Strategy as GoogleStrategy } from "passport-google-oauth20"
import {config} from "./config/config.js"

const app = express()
app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())
app.use(passport.initialize())

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},(accesToken, refreshToken, profile, done) =>{
    return done(null, profile)
}))


app.use("/api/auth", authRoutes)


export default app