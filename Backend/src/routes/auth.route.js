import {Router} from "express";
import { registerUser, login, googleAuthCallback } from "../controllers/auth.controller.js";
import { validateRegisterUser , validateLoginUser} from "../validator/auth.validator.js";
import passport from "passport";

const router = Router();

router.post("/register", validateRegisterUser, registerUser);

router.post("/login", validateLoginUser, login)

router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}))

router.get("/google/callback", passport.authenticate("google", {session: false}), googleAuthCallback)

export default router;
