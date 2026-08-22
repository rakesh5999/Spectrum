import {Router} from "express";
import { registerUser, login } from "../controllers/auth.controller.js";
import { validateRegisterUser , validateLoginUser} from "../validator/auth.validator.js";

const router = Router();

router.post("/register", validateRegisterUser, registerUser);

router.post("/login", validateLoginUser, login)

export default router;
