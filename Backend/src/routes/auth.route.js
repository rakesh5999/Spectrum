import {Router} from "express";
import { registerUser, login, googleAuthCallback, getMe } from "../controllers/auth.controller.js";
import { validateRegisterUser , validateLoginUser} from "../validator/auth.validator.js";
import passport from "passport";
import {config} from "../config/config.js"
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validateRegisterUser, registerUser);

router.post("/login", validateLoginUser, login)

router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}))

router.get("/google/callback",
   passport.authenticate("google", 
    {session: false,
     failureRedirect: config.NODE_ENV === "development" ? "http://localhost:5173/login" : "/login"
    }), googleAuthCallback)

router.get("/me", authenticateUser, getMe)

export default router;
